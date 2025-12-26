'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CreditCard, Smartphone, Check, Package, Truck, Shield } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from '@/components/StripeCheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'vipps' | 'card' | 'klarna'>('card');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    city: ''
  });

  const shippingCost = cart.total >= 500 ? 0 : 79;
  const totalWithShipping = cart.total + shippingCost;

  // Last brukerens adresser hvis innlogget
  useEffect(() => {
    if (user) {
      loadUserAddresses();
      // Auto-fyll email fra brukerkonto
      if (user.email) {
        setFormData(prev => ({ ...prev, email: user.email! }));
      }
    }
  }, [user]);

  async function loadUserAddresses() {
    if (!user) return;
    
    setLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      setSavedAddresses(data || []);
      
      // Auto-velg default-adresse hvis den finnes
      const defaultAddress = data?.find(addr => addr.is_default);
      if (defaultAddress) {
        selectAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  }

  function selectAddress(address: any) {
    setSelectedAddressId(address.id);
    setFormData({
      firstName: address.first_name || '',
      lastName: address.last_name || '',
      email: formData.email || user?.email || '',
      phone: address.phone || '',
      address: address.address_line1 || '',
      zipCode: address.postal_code || '',
      city: address.city || ''
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Move to payment step
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Create order and payment intent
      setProcessingOrder(true);
      try {
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Calculate totals
        const subtotal = cart.total;
        const shipping = shippingCost;
        const total = subtotal + shipping;

        console.log('Creating order with data:', {
          orderNumber,
          userId: user?.id,
          email: formData.email,
          subtotal,
          shipping,
          total
        });

        // Create order in database
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: user?.id || null,
            email: formData.email,
            status: 'pending',
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
            subtotal: subtotal,
            shipping_cost: shipping,
            total: total,
            payment_method: paymentMethod,
            payment_status: 'pending',
            shipping_first_name: formData.firstName,
            shipping_last_name: formData.lastName,
            shipping_address_line1: formData.address,
            shipping_postal_code: formData.zipCode,
            shipping_city: formData.city,
            shipping_country: 'Norge'
          })
          .select()
          .single();

        console.log('Order creation result:', { order, orderError });

        if (orderError) {
          console.error('Order error details:', orderError);
          throw orderError;
        }

        console.log('Order created successfully:', order);

        // Create order items
        const orderItems = cart.items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity
        }));

        console.log('Creating order items:', orderItems);

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items error:', itemsError);
          throw itemsError;
        }

        console.log('Order items created successfully');

        // Create Stripe payment intent
        console.log('Creating payment intent for:', { total, orderNumber, email: formData.email });
        
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: orderNumber,
            customerEmail: formData.email
          })
        });

        const data = await response.json();
        console.log('Payment intent response:', { ok: response.ok, status: response.status, data });
        
        if (!response.ok) throw new Error(data.error || 'Payment intent creation failed');

        setClientSecret(data.clientSecret);
        setOrderId(orderNumber);
        
        console.log('All done! Client secret and order ID set');
      } catch (error: any) {
        console.error('Error creating order:', error);
        console.error('Error details:', {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        });
        
        let errorMessage = 'Det oppstod en feil ved behandling av ordren. Vennligst prøv igjen.';
        if (error?.message) {
          errorMessage += `\n\nDetaljer: ${error.message}`;
        }
        
        alert(errorMessage);
        setStep(1);
      } finally {
        setProcessingOrder(false);
      }
    }
  };

  // Redirect til handlekurv hvis tom
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/handlekurv');
    }
  }, [cart.items.length, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero with Stepper */}
      <section className="bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-[#C9A067] rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-8">
            Kasse
          </h1>
          
          {/* Progress Stepper */}
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= 1 ? 'bg-white text-[#2C5F4F]' : 'bg-white/20 text-white'
              }`}>
                {step > 1 ? <Check className="w-6 h-6" /> : '1'}
              </div>
              <span className={`hidden sm:block font-medium ${step >= 1 ? 'text-white' : 'text-white/60'}`}>
                Leveringsinformasjon
              </span>
            </div>
            <div className="w-16 h-0.5 bg-white/30" />
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= 2 ? 'bg-white text-[#2C5F4F]' : 'bg-white/20 text-white'
              }`}>
                2
              </div>
              <span className={`hidden sm:block font-medium ${step >= 2 ? 'text-white' : 'text-white/60'}`}>
                Betaling
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skjema */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Lagrede adresser - vises kun for innloggede */}
                  {user && savedAddresses.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl shadow-elegant border border-stone-200">
                      <h2 className="text-2xl font-semibold text-stone-900 mb-6">Velg leveringsadresse</h2>
                      <div className="space-y-3">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => selectAddress(addr)}
                            className={`w-full p-5 border-2 rounded-2xl text-left transition-all ${
                              selectedAddressId === addr.id
                                ? 'border-[#2C5F4F] bg-[#2C5F4F]/5 shadow-md'
                                : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-stone-900 mb-1">
                                  {addr.first_name} {addr.last_name}
                                  {addr.is_default && (
                                    <span className="ml-2 text-xs px-2 py-1 bg-[#2C5F4F] text-white rounded-full">
                                      Standard
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-stone-600">{addr.address_line1}</p>
                                <p className="text-sm text-stone-600">{addr.postal_code} {addr.city}</p>
                                {addr.phone && <p className="text-sm text-stone-600">{addr.phone}</p>}
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedAddressId === addr.id ? 'border-[#2C5F4F] bg-[#2C5F4F]' : 'border-stone-300'
                              }`}>
                                {selectedAddressId === addr.id && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-stone-500 mt-4">Eller fyll inn ny adresse nedenfor</p>
                    </div>
                  )}

                  {/* Kontaktinformasjon */}
                  <div className="bg-white p-8 rounded-3xl shadow-elegant border border-stone-200">
                    <h2 className="text-2xl font-semibold text-stone-900 mb-6">Kontaktinformasjon</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-stone-900 mb-2">
                          Fornavn *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                          placeholder="Ola"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-900 mb-2">
                          Etternavn *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                          placeholder="Nordmann"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-900 mb-2">
                          E-post *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                          placeholder="ola@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-900 mb-2">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                          placeholder="+47 123 45 678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Leveringsadresse */}
                  <div className="bg-white p-8 rounded-3xl shadow-elegant border border-stone-200">
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="w-6 h-6 text-[#2C5F4F]" />
                      <h2 className="text-2xl font-semibold text-stone-900">Leveringsadresse</h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-stone-900 mb-2">
                          Adresse *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                          placeholder="Storgata 1"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-stone-900 mb-2">
                            Postnummer *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                            placeholder="0123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-stone-900 mb-2">
                            Poststed *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                            placeholder="Oslo"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Only show for step 1 */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={processingOrder}
                      className="flex-1 py-4 gradient-primary text-white rounded-xl hover:shadow-elegant-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {processingOrder ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                          <span>Forbereder betaling...</span>
                        </>
                      ) : (
                        'Gå til betaling'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                  {/* Betalingsmetode med Stripe */}
                  <div className="bg-white p-8 rounded-3xl shadow-elegant border border-stone-200">
                    <h2 className="text-2xl font-semibold text-stone-900 mb-2">Betaling</h2>
                    <p className="text-sm text-stone-500 mb-6">Alle transaksjoner er sikre og krypterte.</p>
                    
                    {clientSecret && orderId ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripeCheckoutForm
                          amount={totalWithShipping}
                          orderId={orderId}
                          customerEmail={formData.email}
                          onSuccess={() => {
                            clearCart();
                            router.push(`/ordre-bekreftelse?orderId=${orderId}`);
                          }}
                          onError={(error) => {
                            console.error('Payment error:', error);
                          }}
                        />
                      </Elements>
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-[#2C5F4F] border-t-transparent rounded-full"></div>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-stone-50 rounded-xl flex items-center gap-2">
                      <Shield className="w-4 h-4 text-stone-600" />
                      <span className="text-sm text-stone-600">Betaling prosesseres sikkert av Stripe</span>
                    </div>
                  </div>

                  {/* Review Order */}
                  <div className="bg-white p-8 rounded-3xl shadow-elegant border border-stone-200">
                    <h2 className="text-2xl font-semibold text-stone-900 mb-6">Ordredetaljer</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-stone-50 rounded-xl">
                        <p className="text-sm font-semibold text-stone-700 mb-2">Leveringsadresse</p>
                        <p className="text-stone-900">{formData.firstName} {formData.lastName}</p>
                        <p className="text-stone-700">{formData.address}</p>
                        <p className="text-stone-700">{formData.zipCode} {formData.city}</p>
                        <p className="text-stone-700">{formData.email}</p>
                        <p className="text-stone-700">{formData.phone}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setClientSecret(null);
                          setOrderId(null);
                        }}
                        className="text-[#2C5F4F] hover:text-[#3A7860] font-medium transition-colors text-sm"
                      >
                        Endre informasjon
                      </button>
                    </div>
                  </div>
              </div>
            )}
          </div>

          {/* Ordresammendrag */}
          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-elegant sticky top-24 border border-stone-200">
                <h2 className="text-2xl font-semibold text-stone-900 mb-6">Ordresammendrag</h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 pb-4 border-b border-stone-200 last:border-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#F8F6F3] to-[#E5E5E5] rounded-xl overflow-hidden relative flex-shrink-0">
                        {item.product.image || item.product.images?.[0] ? (
                          <Image
                            src={item.product.image || item.product.images?.[0] || ''}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-stone-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate mb-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-stone-600">
                          {item.quantity} x {item.product.price},-
                        </p>
                        <p className="text-sm font-bold text-stone-900 mt-1">
                          {item.product.price * item.quantity},-
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 border-t-2 border-stone-200 pt-6">
                  <div className="flex justify-between text-stone-700">
                    <span>Delsum</span>
                    <span className="font-semibold">{cart.total},-</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>Frakt</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-[#2C5F4F]">Gratis</span>
                      ) : (
                        `${shippingCost},-`
                      )}
                    </span>
                  </div>
                  {cart.total >= 500 && (
                    <div className="p-3 bg-[#2C5F4F]/10 rounded-xl flex items-center gap-2">
                      <Check className="w-5 h-5 text-[#2C5F4F]" />
                      <span className="text-sm font-medium text-[#2C5F4F]">Gratis frakt!</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-stone-200 pt-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-stone-900">Totalt</span>
                    <span className="text-3xl font-bold text-[#2C5F4F]">
                      {totalWithShipping},-
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">inkl. MVA</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Shield className="w-4 h-4 text-[#2C5F4F]" />
                    <span>Sikker betaling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Truck className="w-4 h-4 text-[#2C5F4F]" />
                    <span>Levering 2-4 virkedager</span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 mt-6 text-center pt-6 border-t border-stone-200">
                  Ved å fullføre kjøpet godtar du våre{' '}
                  <a href="/vilkar" className="underline hover:text-[#2C5F4F]">
                    vilkår og betingelser
                  </a>
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
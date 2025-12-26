'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Sparkles, Gift } from 'lucide-react';

export default function HandlekurvPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const shippingCost = cart.total >= 500 ? 0 : 79;
  const totalWithShipping = cart.total + shippingCost;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center py-20 px-6">
          <div className="w-32 h-32 rounded-full gradient-primary mx-auto mb-8 flex items-center justify-center opacity-20">
            <ShoppingBag className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 mb-4 tracking-tight">
            Handlekurven er tom
          </h1>
          <p className="text-stone-600 mb-10 text-lg">
            Legg til produkter for å fortsette
          </p>
          <Link
            href="/produkter"
            className="inline-flex items-center px-10 py-4 gradient-primary text-white rounded-full hover:shadow-elegant-lg transition-all font-semibold group"
          >
            <span>Se produkter</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-[#C9A067] rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            Handlekurv
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Produktliste */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white p-6 rounded-3xl shadow-elegant border border-stone-200 flex gap-6 hover:shadow-elegant-lg transition-all"
              >
                {/* Produktbilde */}
                <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-[#F8F6F3] to-[#E5E5E5] rounded-2xl overflow-hidden relative">
                  {item.product.image || item.product.images?.[0] ? (
                    <Image
                      src={item.product.image || item.product.images?.[0] || ''}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🧴</span>
                    </div>
                  )}
                </div>

                {/* Produktinfo */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-2">
                    <div>
                      <Link
                        href={`/produkter/${item.product.id}`}
                        className="font-semibold text-stone-900 hover:text-[#2C5F4F] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-stone-500 mt-1">{item.product.brand}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 hover:bg-stone-100 rounded-xl h-fit transition-colors"
                      aria-label="Fjern produkt"
                    >
                      <X className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Mengdevelger */}
                    <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-3 hover:bg-stone-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-stone-700" />
                      </button>
                      <span className="px-6 font-semibold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-3 hover:bg-stone-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-stone-700" />
                      </button>
                    </div>

                    {/* Pris */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-stone-900">
                        {item.product.price * item.quantity},-
                      </p>
                      <p className="text-sm text-stone-500">
                        {item.product.price},- per stk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sammendrag */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-elegant sticky top-24 border border-stone-200">
              <h2 className="text-2xl font-semibold text-stone-900 mb-6">Sammendrag</h2>

              {cart.total >= 500 && (
                <div className="mb-6 p-4 rounded-2xl glass-effect bg-[#C9A067] text-white flex items-start gap-3">
                  <Gift className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Gratis frakt!</p>
                    <p className="text-white/90">Du har kvalifisert for gratis frakt</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
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
                {cart.total < 500 && (
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <p className="text-sm text-stone-600">
                      Kjøp for <span className="font-semibold text-[#2C5F4F]">{500 - cart.total},-</span> mer for gratis frakt
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-stone-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-stone-900">Totalt</span>
                  <span className="text-3xl font-bold text-[#2C5F4F]">
                    {totalWithShipping},-
                  </span>
                </div>
                <p className="text-sm text-stone-500 mt-2">inkl. MVA</p>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 gradient-primary text-white text-center rounded-xl hover:shadow-elegant-lg transition-all font-semibold mb-4 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Gå til betaling
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="/produkter"
                className="block text-center text-[#2C5F4F] hover:text-[#3A7860] font-medium transition-colors"
              >
                Fortsett å handle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

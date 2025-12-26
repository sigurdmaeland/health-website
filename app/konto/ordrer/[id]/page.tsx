'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Phone, Mail } from 'lucide-react'
import Image from 'next/image'

interface OrderItem {
  id: string
  product_name: string
  product_image: string
  product_slug: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderDetails {
  id: string
  order_number: string
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_first_name: string
  shipping_last_name: string
  shipping_company: string
  shipping_address_line1: string
  shipping_address_line2: string
  shipping_postal_code: string
  shipping_city: string
  shipping_country: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  payment_method: string
  payment_status: string
  tracking_number: string
  created_at: string
  items: OrderItem[]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/konto')
      return
    }
    loadOrderDetails()
  }, [user, router])

  async function loadOrderDetails() {
    try {
      // Get order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user?.id)
        .single()

      if (orderError) throw orderError

      // Get order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', params.id)

      if (itemsError) throw itemsError

      setOrder({
        ...orderData,
        items: itemsData || []
      })
    } catch (error) {
      console.error('Error loading order details:', error)
      router.push('/konto/ordrer')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Venter', color: 'bg-yellow-100 text-yellow-800' }
      case 'processing': return { label: 'Behandles', color: 'bg-blue-100 text-blue-800' }
      case 'shipped': return { label: 'Sendt', color: 'bg-purple-100 text-purple-800' }
      case 'delivered': return { label: 'Levert', color: 'bg-emerald-100 text-emerald-800' }
      case 'cancelled': return { label: 'Kansellert', color: 'bg-red-100 text-red-800' }
      default: return { label: status, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Betalt'
      case 'pending': return 'Venter'
      case 'failed': return 'Feilet'
      case 'refunded': return 'Refundert'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ordre ikke funnet</h2>
          <Link href="/konto/ordrer" className="text-emerald-600 hover:text-emerald-700">
            Tilbake til ordrer
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/konto/ordrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til ordrer
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ordre {order.order_number}</h1>
              <p className="text-gray-600 mt-2">
                Bestilt {new Date(order.created_at).toLocaleDateString('nb-NO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produkter i ordren
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product_image && (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product_name}</h3>
                      <p className="text-sm text-gray-600">Antall: {item.quantity}</p>
                      <p className="text-sm text-gray-600">{item.unit_price.toFixed(2)} kr per stk</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.total_price.toFixed(2)} kr</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking */}
            {order.tracking_number && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Sporingsinformasjon
                </h2>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Sporingsnummer</p>
                  <p className="text-lg font-mono font-semibold text-emerald-900">{order.tracking_number}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ordresammendrag</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delsum</span>
                  <span className="font-medium">{order.subtotal.toFixed(2)} kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frakt</span>
                  <span className="font-medium">{order.shipping_cost.toFixed(2)} kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MVA</span>
                  <span className="font-medium">{order.tax.toFixed(2)} kr</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-base">
                  <span>Total</span>
                  <span className="text-emerald-600">{order.total.toFixed(2)} kr</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Leveringsadresse
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.shipping_first_name} {order.shipping_last_name}
                </p>
                {order.shipping_company && <p>{order.shipping_company}</p>}
                <p>{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                <p>{order.shipping_postal_code} {order.shipping_city}</p>
                <p>{order.shipping_country}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Kontaktinformasjon</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{order.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Betalingsinformasjon
              </h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Metode</span>
                  <span className="font-medium">{order.payment_method || 'Ikke spesifisert'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'
                  }`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

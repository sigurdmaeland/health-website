'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Package, ArrowLeft, ChevronRight, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  created_at: string
  item_count: number
}

export default function OrdrePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!user) {
      router.push('/konto')
      return
    }
    loadOrders()
  }, [user, router])

  async function loadOrders() {
    try {
      // Get orders with item count
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total,
          created_at
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Get item counts for each order
      const ordersWithCounts = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { count } = await supabase
            .from('order_items')
            .select('*', { count: 'exact', head: true })
            .eq('order_id', order.id)

          return {
            ...order,
            item_count: count || 0
          }
        })
      )

      setOrders(ordersWithCounts)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Venter', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      case 'processing':
        return { label: 'Behandles', color: 'bg-blue-100 text-blue-800', icon: Package }
      case 'shipped':
        return { label: 'Sendt', color: 'bg-purple-100 text-purple-800', icon: Truck }
      case 'delivered':
        return { label: 'Levert', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle }
      case 'cancelled':
        return { label: 'Kansellert', color: 'bg-red-100 text-red-800', icon: XCircle }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Package }
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/konto"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til Min konto
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mine ordrer</h1>
          <p className="text-gray-600 mt-2">Se alle dine bestillinger og sporings informasjon</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Alle' },
            { value: 'pending', label: 'Venter' },
            { value: 'processing', label: 'Behandles' },
            { value: 'shipped', label: 'Sendt' },
            { value: 'delivered', label: 'Levert' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'Ingen ordre ennå' : 'Ingen ordre i denne kategorien'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start å handle for å se dine bestillinger her' 
                : 'Du har ingen ordre med denne statusen'}
            </p>
            <Link
              href="/produkter"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Fortsett å handle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon

              return (
                <Link
                  key={order.id}
                  href={`/konto/ordrer/${order.id}`}
                  className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Ordre {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('nb-NO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Antall varer</p>
                        <p className="text-lg font-semibold text-gray-900">{order.item_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {order.total.toFixed(2)} kr
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

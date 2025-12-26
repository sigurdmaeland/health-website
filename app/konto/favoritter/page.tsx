'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Heart, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

interface FavoriteProduct {
  id: string
  product_id: string
  created_at: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
    description: string
    stock_quantity: number
  }
}

export default function FavoritterPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/konto')
      return
    }
    loadFavorites()
  }, [user, router])

  async function loadFavorites() {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform data to match interface
      const transformedData: FavoriteProduct[] = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        created_at: item.created_at,
        product: {
          id: item.product_id,
          name: item.product_name || 'Ukjent produkt',
          slug: item.product_slug || '',
          price: item.product_price || 0,
          image: item.product_image || '',
          description: item.product_description || '',
          stock_quantity: 10 // Default value
        }
      }))
      
      setFavorites(transformedData)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  async function removeFavorite(favoriteId: string) {
    setRemoving(favoriteId)
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) throw error
      
      setFavorites(favorites.filter(fav => fav.id !== favoriteId))
    } catch (error) {
      console.error('Error removing favorite:', error)
      alert('Kunne ikke fjerne favoritt. Prøv igjen.')
    } finally {
      setRemoving(null)
    }
  }

  function handleAddToCart(product: FavoriteProduct['product']) {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      image: product.image,
      category: '',
      brand: '',
      rating: 0,
      reviews: 0,
      inStock: product.stock_quantity > 0,
      stock_quantity: product.stock_quantity
    }, 1)
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                Mine favoritter
              </h1>
              <p className="text-gray-600 mt-2">
                {favorites.length} {favorites.length === 1 ? 'produkt' : 'produkter'} i din ønskeliste
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen favoritter ennå</h3>
            <p className="text-gray-600 mb-6">
              Start å legge til produkter i favoritter for å holde styr på det du liker
            </p>
            <Link
              href="/produkter"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Utforsk produkter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <Link href={`/produkter/${favorite.product.slug}`} className="block relative">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {favorite.product.image ? (
                      <Image
                        src={favorite.product.image}
                        alt={favorite.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Ingen bilde
                      </div>
                    )}
                  </div>
                  
                  {/* Stock Badge */}
                  {favorite.product.stock_quantity === 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Utsolgt
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeFavorite(favorite.id)
                    }}
                    disabled={removing === favorite.id}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                  >
                    {removing === favorite.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    ) : (
                      <Trash2 className="w-5 h-5 text-red-500" />
                    )}
                  </button>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/produkter/${favorite.product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-emerald-600 line-clamp-2">
                      {favorite.product.name}
                    </h3>
                  </Link>
                  
                  {favorite.product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {favorite.product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-emerald-600">
                      {favorite.product.price.toFixed(2)} kr
                    </p>
                    
                    <button
                      onClick={() => handleAddToCart(favorite.product)}
                      disabled={favorite.product.stock_quantity === 0}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {favorite.product.stock_quantity === 0 ? 'Utsolgt' : 'Legg til'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Lagt til {new Date(favorite.created_at).toLocaleDateString('nb-NO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

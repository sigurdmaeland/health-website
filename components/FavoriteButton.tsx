'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/client'

interface FavoriteButtonProps {
  productId: string
  productName: string
  productSlug: string
  productPrice: number
  productImage: string
  productDescription?: string
  size?: 'sm' | 'md' | 'lg'
  showToast?: boolean
}

export default function FavoriteButton({ 
  productId, 
  productName,
  productSlug,
  productPrice,
  productImage,
  productDescription,
  size = 'md', 
  showToast = true 
}: FavoriteButtonProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  useEffect(() => {
    if (user) {
      checkIfFavorite()
    }
  }, [user, productId])

  async function checkIfFavorite() {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (!error && data) {
        setIsFavorite(true)
      }
    } catch (error) {
      // Not a favorite
      setIsFavorite(false)
    }
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert('Du må være innlogget for å legge til favoritter')
      return
    }

    setLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (error) throw error
        setIsFavorite(false)
        if (showToast) {
          // You can add a toast notification here
          console.log('Fjernet fra favoritter')
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            product_id: productId,
            product_name: productName,
            product_slug: productSlug,
            product_price: productPrice,
            product_image: productImage,
            product_description: productDescription || ''
          })

        if (error) throw error
        setIsFavorite(true)
        if (showToast) {
          // You can add a toast notification here
          console.log('Lagt til i favoritter')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Noe gikk galt. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorite ? 'Fjern fra favoritter' : 'Legg til i favoritter'}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
        }`}
      />
    </button>
  )
}

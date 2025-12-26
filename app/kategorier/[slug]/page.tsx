'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  images: string[];
  in_stock: boolean;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function KategoriPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const supabase = createClient();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    if (params.slug) {
      fetchCategoryAndProducts(params.slug as string);
    }
  }, [params.slug]);

  async function fetchCategoryAndProducts(slug: string) {
    try {
      // Hent kategori
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Hent produkter i kategorien
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryData.name)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = (product: Product) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.compare_at_price || undefined,
      image: product.images[0] || '',
      images: product.images,
      category: product.category,
      brand: product.category,
      rating: 4.5,
      reviews: 0,
      inStock: product.in_stock,
    };
    addToCart(cartProduct as any, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Sorter produkter
  let sortedProducts = [...products];
  switch (sortBy) {
    case 'price-low':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'featured':
      sortedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
    default:
      break;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Laster kategori...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center py-20 px-6">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-3xl font-light text-stone-900 mb-4">Kategorien ble ikke funnet</h1>
          <p className="text-stone-600 mb-8">Denne kategorien eksisterer ikke eller har blitt fjernet.</p>
          <Link
            href="/produkter"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white rounded-full hover:shadow-elegant-lg transition-all font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            Tilbake til produkter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {showToast && (
        <div className="fixed top-20 right-4 z-50 glass-effect bg-[#2C5F4F] text-white px-6 py-4 rounded-2xl shadow-elegant animate-slide-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span className="font-medium">Produkt lagt til i handlekurv!</span>
          </div>
        </div>
      )}

      {/* Hero Section with Category Image */}
      <section className="relative overflow-hidden h-[400px]">
        {category.image ? (
          <>
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FAFAF8]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F]">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col gap-4">
              <Link
                href="/produkter"
                className="inline-flex items-center text-white/90 hover:text-white transition-colors w-fit"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Tilbake til produkter
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit">
                <Sparkles className="w-4 h-4 text-[#C9A067]" />
                <span className="text-sm font-medium text-white">Kategori</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 tracking-tight text-white mt-6">
              {category.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with sorting */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-stone-600 font-medium">
              <span className="text-2xl font-semibold text-[#2C5F4F]">{sortedProducts.length}</span> produkt{sortedProducts.length !== 1 ? 'er' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-stone-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900 font-medium cursor-pointer"
            >
              <option value="popular">Mest populær</option>
              <option value="price-low">Pris: Lav til høy</option>
              <option value="price-high">Pris: Høy til lav</option>
              <option value="featured">Utvalgte først</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-200">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-stone-600 text-lg font-medium">Ingen produkter i denne kategorien ennå</p>
            <p className="text-stone-500 mt-2 mb-8">Kom tilbake snart for nye produkter!</p>
            <Link
              href="/produkter"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white rounded-full hover:shadow-elegant-lg transition-all font-semibold"
            >
              Se alle produkter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

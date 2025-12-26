'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
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

export default function ProdukterPage() {
  const { addToCart } = useCart();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Alle']);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setProducts(data || []);

      // Hent unike kategorier
      const uniqueCategories = Array.from(new Set(data?.map(p => p.category) || []));
      setCategories(['Alle', ...uniqueCategories]);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = (product: Product) => {
    // Konverter database product til cart product format
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.compare_at_price || undefined,
      image: product.images[0] || '',
      images: product.images,
      category: product.category,
      brand: product.category, // Bruker category som brand midlertidig
      rating: 4.5, // Default rating
      reviews: 0,
      inStock: product.in_stock,
    };
    addToCart(cartProduct as any, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filtrer og sorter produkter
  let filteredProducts = [...products];

  if (selectedCategory !== 'Alle') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  filteredProducts = filteredProducts.filter(
    p => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Laster produkter...</p>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] text-white py-16 md:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#C9A067]" />
            <span className="text-sm font-medium">Premium Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 tracking-tight animate-fade-in">
            Våre produkter
          </h1>
          <p className="text-xl text-white/90 max-w-2xl animate-fade-in">
            Utforsk vårt nøye utvalgte sortiment av premium helse- og skjønnhetsprodukter
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-elegant sticky top-24 border border-stone-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900">Filtrer</h2>
              </div>

              {/* Kategorier */}
              <div className="mb-8">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm tracking-wider uppercase">Kategori</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-5 py-3 rounded-xl transition-all font-medium ${
                        selectedCategory === cat
                          ? 'gradient-primary text-white shadow-md transform scale-[1.02]'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 hover:shadow-sm'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pris */}
              <div className="mb-8">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm tracking-wider uppercase">Prisområde</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-[#2C5F4F] cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-stone-600">0 kr</span>
                    <span className="px-4 py-2 bg-[#2C5F4F] text-white rounded-full text-sm font-semibold">
                      {priceRange[1]} kr
                    </span>
                  </div>
                </div>
              </div>

              {/* Sortering */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-4 text-sm tracking-wider uppercase">Sorter etter</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900 font-medium cursor-pointer"
                >
                  <option value="popular">Mest populær</option>
                  <option value="price-low">Pris: Lav til høy</option>
                  <option value="price-high">Pris: Høy til lav</option>
                  <option value="rating">Beste vurdering</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Produktgrid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-stone-600 font-medium">
                <span className="text-2xl font-semibold text-[#2C5F4F]">{filteredProducts.length}</span> produkt{filteredProducts.length !== 1 ? 'er' : ''}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent ml-6"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-200">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-stone-600 text-lg font-medium">Ingen produkter funnet</p>
                <p className="text-stone-500 mt-2">Prøv å justere filtrene dine</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

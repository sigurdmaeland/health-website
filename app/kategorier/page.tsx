'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Grid3x3, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  product_count?: number;
}

export default function KategorierPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Hent antall produkter per kategori
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category', category.name);

          return {
            ...category,
            product_count: count || 0
          };
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Laster kategorier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] text-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
            <Grid3x3 className="w-4 h-4 text-[#C9A067]" />
            <span className="text-sm font-medium">Utforsk våre kategorier</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight animate-fade-in">
            Alle Kategorier
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-fade-in leading-relaxed">
            Finn akkurat det du leter etter innen hudpleie, hårpleie og velvære
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#2C5F4F] mb-2">
                {categories.length}
              </div>
              <p className="text-stone-600 font-medium">Kategorier</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#2C5F4F] mb-2">
                {categories.reduce((acc, cat) => acc + (cat.product_count || 0), 0)}
              </div>
              <p className="text-stone-600 font-medium">Produkter totalt</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#2C5F4F] mb-2">
                Gratis
              </div>
              <p className="text-stone-600 font-medium">Frakt over 500 kr</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#2C5F4F] mb-2">
                2-4
              </div>
              <p className="text-stone-600 font-medium">Dager levering</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">
            Finn din kategori
          </h2>
          <p className="text-lg text-stone-600">
            Utforsk vårt kuraterte utvalg av premium produkter
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/kategorier/${category.slug}`}
                className="group relative overflow-hidden rounded-3xl shadow-elegant hover:shadow-elegant-lg transition-all duration-500 bg-white border border-stone-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#2C5F4F]/5 to-[#3A7860]/5">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid3x3 className="w-20 h-20 text-[#2C5F4F]/20" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-[#2C5F4F] shadow-lg">
                    {category.product_count || 0} produkter
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-stone-900 mb-2 group-hover:text-[#2C5F4F] transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-[#2C5F4F] font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Utforsk produkter</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-200">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-stone-600 text-lg font-medium">Ingen kategorier funnet</p>
            <p className="text-stone-500 mt-2 mb-8">Kom tilbake snart for nye produkter!</p>
            <Link
              href="/produkter"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white rounded-full hover:shadow-elegant-lg transition-all font-semibold"
            >
              Se alle produkter
            </Link>
          </div>
        )}

        {/* CTA Banner */}
        {categories.length > 0 && (
          <div className="mt-20 relative overflow-hidden bg-gradient-to-br from-[#2C5F4F] to-[#3A7860] rounded-3xl p-12 md:p-16 text-white text-center shadow-elegant">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#C9A067] rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
                Trenger du hjelp med å finne rett produkt?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Vårt team er klare til å hjelpe deg med personlige anbefalinger
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#2C5F4F] rounded-full hover:shadow-elegant-lg transition-all font-semibold text-lg hover:scale-105"
              >
                Kontakt oss
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

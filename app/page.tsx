'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Truck, Shield, Headphones, ArrowRight, Sparkles, Award, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
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

export default function Home() {
  const { addToCart } = useCart();
  const supabase = createClient();
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Karusell-data
  const carouselSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2000',
      title: 'Naturlige Kosttilskudd',
      subtitle: 'Ren velvære',
      description: 'Vitaminer og mineraler for optimal helse',
      ctaText: 'Utforsk',
      ctaUrl: '/produkter',
      bgColor: 'from-emerald-700 to-teal-700'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2000',
      title: 'Naturlig Skjønnhet',
      subtitle: 'Organisk velværeserie',
      description: 'Cruelty-free og veganske produkter',
      ctaText: 'Se kolleksjonen',
      ctaUrl: '/kategorier/hudpleie',
      bgColor: 'from-teal-700 to-cyan-800'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=2000',
      title: 'Nye produkter',
      subtitle: 'Årets nyheter',
      description: 'Oppdage de siste tilskuddene til vår kolleksjon',
      ctaText: 'Se hva som er nytt',
      ctaUrl: '/produkter?filter=new',
      bgColor: 'from-emerald-600 to-green-700'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Auto-play karusell
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  async function fetchData() {
    try {
      // Hent produkter
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products error:', productsError);
        throw productsError;
      }
      setProducts(productsData || []);

      // Hent kategorier
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }
      setCategories(categoriesData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
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
      brand: product.category,
      rating: 4.5,
      reviews: 0,
      inStock: product.in_stock,
    };
    addToCart(cartProduct as any, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const featuredProducts = products.filter(p => p.featured);
  const allProducts = products.slice(0, 8);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-[#FAFAF8]">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 glass-effect border border-stone-200 text-stone-900 px-6 py-4 rounded-2xl shadow-elegant animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="font-semibold">Lagt til i handlekurv!</p>
              <p className="text-sm text-stone-600">Produktet er lagt til</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Bildekarusell */}
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Slides */}
        <div className="relative h-full">
          {carouselSlides.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.ctaUrl}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-75`}></div>
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl text-white animate-fade-in">
                  <p className="text-lg md:text-xl font-light mb-4 tracking-wide">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 text-white/90">
                    {slide.description}
                  </p>
                  <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-full font-semibold text-lg hover:shadow-elegant-lg transition-all hover:scale-105">
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
          aria-label="Forrige slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
          aria-label="Neste slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                goToSlide(index);
              }}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
              }`}
              aria-label={`Gå til slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-16 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-5 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1 text-lg">Gratis frakt</h3>
                <p className="text-sm text-stone-600">Over 500 kr • 2-4 dager</p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1 text-lg">Sikker betaling</h3>
                <p className="text-sm text-stone-600">Kryptert og trygg</p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1 text-lg">Premium kvalitet</h3>
                <p className="text-sm text-stone-600">Kuratert utvalg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Clean Design */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-[#C9A067] font-medium text-sm tracking-wider uppercase mb-4 block">
              Våre Kolleksjoner
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
              Utforsk etter kategori
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Hvert produkt er nøye utvalgt for å gi deg den beste opplevelsen
            </p>
          </div>

          {/* Horizontal Scrollable Categories */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/kategorier/${category.slug}`}
                  className="group relative flex-shrink-0 w-72 h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-white snap-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Category Image */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100" />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-center">
                      {category.name}
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center text-sm font-medium gap-2">
                        Utforsk
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Banner */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Banner 1 */}
            <Link
              href="/produkter?filter=featured"
              className="group relative h-[400px] rounded-3xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200"
                alt="Eksklusiv serie"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
                <span className="text-sm font-medium tracking-wider uppercase mb-4">Eksklusiv</span>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Ansiktspleie<br />Serie
                </h3>
                <p className="text-lg mb-6 text-white/90 max-w-sm">
                  Premium produkter for perfekt hud
                </p>
                <span className="inline-flex items-center gap-2 text-lg font-semibold group-hover:gap-4 transition-all">
                  Oppdag mer
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>

            {/* Banner 2 */}
            <Link
              href="/produkter?filter=new"
              className="group relative h-[400px] rounded-3xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=1200"
                alt="Nye produkter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-teal-900/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center items-end text-right p-12 text-white">
                <span className="text-sm font-medium tracking-wider uppercase mb-4">Nyheter 2025</span>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Naturlig<br />Skjønnhet
                </h3>
                <p className="text-lg mb-6 text-white/90 max-w-sm">
                  Organiske og veganske produkter
                </p>
                <span className="inline-flex items-center gap-2 text-lg font-semibold group-hover:gap-4 transition-all">
                  Se kolleksjonen
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div className="animate-fade-in">
              <span className="text-[#C9A067] font-medium text-sm tracking-wider uppercase mb-4 block">
                Bestselgere
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
                Våre favoritter
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl">
                De mest elskede produktene blant våre kunder
              </p>
            </div>
            <Link
              href="/produkter"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-stone-200 hover:border-[#2C5F4F] hover:bg-[#2C5F4F]/5 transition-all font-medium text-stone-700 hover:text-[#2C5F4F] group"
            >
              Se alle
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 w-[280px] sm:w-[320px] animate-fade-in snap-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/produkter"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-white font-semibold hover:shadow-elegant-lg transition-all"
            >
              Se alle produkter
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-20 text-center text-white shadow-elegant-lg">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">
                Eksklusiv velkomstgave
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Meld deg på nyhetsbrevet og få 15% rabatt på ditt første kjøp
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Din e-postadresse"
                  className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-white/30 text-stone-900 shadow-lg"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-white text-[#2C5F4F] rounded-full hover:shadow-elegant-lg transition-all font-semibold whitespace-nowrap hover:scale-105 active:scale-95"
                >
                  Meld meg på
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

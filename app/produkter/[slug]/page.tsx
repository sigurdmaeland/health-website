'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ChevronLeft, Heart, Truck, Package, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FavoriteButton from '@/components/FavoriteButton';
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
  ingredients: string;
  usage: string;
  in_stock: boolean;
  featured: boolean;
  faqs: { question: string; answer: string }[] | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const supabase = createClient();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params.slug]);

  async function fetchProduct(slug: string) {
    try {
      // Hent produkt
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Hent relaterte produkter
      if (productData) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', productData.id)
          .limit(4);

        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    
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
    addToCart(cartProduct as any, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRelatedProductCart = (relatedProduct: any) => {
    const cartProduct = {
      id: relatedProduct.id,
      name: relatedProduct.name,
      description: relatedProduct.description,
      price: relatedProduct.price,
      originalPrice: relatedProduct.compare_at_price || undefined,
      image: relatedProduct.images?.[0] || relatedProduct.image || '',
      images: relatedProduct.images || [],
      category: relatedProduct.category,
      brand: relatedProduct.category,
      rating: 4.5,
      reviews: 0,
      inStock: relatedProduct.in_stock || true,
      ingredients: relatedProduct.ingredients || [],
      usage: relatedProduct.usage || '',
      faqs: relatedProduct.faqs || [],
    };
    addToCart(cartProduct as any, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const discountPercentage = product?.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Laster produkt...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-stone-300 mx-auto mb-6" />
          <h1 className="text-3xl font-light text-stone-900 mb-4">Produktet ble ikke funnet</h1>
          <p className="text-stone-600 mb-8">Dette produktet eksisterer ikke eller har blitt fjernet.</p>
          <Link
            href="/produkter"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Tilbake til produkter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showToast && (
        <div className="fixed top-24 right-4 z-50 glass-effect border border-stone-200 text-stone-900 px-6 py-4 rounded-2xl shadow-elegant animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="font-semibold">Lagt til i handlekurv!</p>
              <p className="text-sm text-stone-600">{quantity} produkt{quantity > 1 ? 'er' : ''} lagt til</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/produkter"
          className="inline-flex items-center text-gray-600 hover:text-[#88B5A0] mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Tilbake til produkter
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Bildegalleri */}
          <div>
            <div className="relative aspect-square bg-gradient-to-br from-[#F5F5F0] to-[#E5E5E5] rounded-2xl mb-4 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-32 h-32 text-stone-300" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square bg-stone-100 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'ring-2 ring-[#2C5F4F]' : ''
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Produktinfo */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#C9A067] font-medium uppercase tracking-wide text-sm mb-2">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
                  {product.name}
                </h1>
              </div>
              <FavoriteButton
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                productPrice={product.price}
                productImage={product.images?.[0]}
                productDescription={product.description}
                size="lg"
                showToast={true}
              />
            </div>

            {/* Pris */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-stone-900">{product.price.toFixed(2)} kr</span>
                {product.compare_at_price && (
                  <>
                    <span className="text-xl text-stone-400 line-through">
                      {product.compare_at_price.toFixed(2)} kr
                    </span>
                    {discountPercentage > 0 && (
                      <span className="px-3 py-1 bg-[#2C5F4F] text-white text-sm font-bold rounded-full">
                        -{discountPercentage}%
                      </span>
                    )}
                  </>
                )}
              </div>
              {!product.in_stock && (
                <p className="text-red-500 font-medium">Utsolgt</p>
              )}
            </div>

            {/* Beskrivelse */}
            <p className="text-stone-700 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Badges */}
            {(product.featured || discountPercentage > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.featured && (
                  <span className="px-3 py-1.5 bg-[#C9A067] text-white font-medium rounded-full text-sm">
                    FEATURED
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                    RABATT
                  </span>
                )}
              </div>
            )}

            {/* Mengdevelger */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-stone-700 font-medium">Antall:</span>
              <div className="flex items-center border-2 border-stone-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-8 font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Legg i handlekurv */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`w-full py-5 rounded-xl font-bold text-lg mb-6 transition-all ${
                product.in_stock
                  ? 'gradient-primary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
              }`}
            >
              {product.in_stock ? 'Legg i handlekurv' : 'Utsolgt'}
            </button>

            {/* Leveringsinfo */}
            <div className="flex items-start gap-3 p-5 bg-gradient-to-br from-[#F8F6F3] to-[#FBF9F6] rounded-xl border border-stone-200">
              <Truck className="w-6 h-6 text-[#2C5F4F] mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-stone-900 mb-1">Gratis frakt over 500 kr</p>
                <p className="text-stone-600">Levering innen 2-4 virkedager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Produktinformasjon tabs */}
        {(product.ingredients || product.usage) && (
          <div className="border-t border-stone-200 pt-12 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {product.ingredients && (
                <div>
                  <h2 className="text-2xl font-medium text-stone-900 mb-6">Ingredienser</h2>
                  <div className="prose prose-stone">
                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{product.ingredients}</p>
                  </div>
                </div>
              )}

              {product.usage && (
                <div>
                  <h2 className="text-2xl font-medium text-stone-900 mb-6">Bruksanvisning</h2>
                  <div className="prose prose-stone">
                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{product.usage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="border-t border-stone-200 pt-12 mb-16">
            <h2 className="text-3xl font-light text-stone-900 mb-2">Ofte stilte spørsmål</h2>
            <p className="text-stone-600 mb-8">
              Finn svar på de vanligste spørsmålene om dette produktet
            </p>
            <div className="space-y-3">
              {product.faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#2C5F4F]/30 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C5F4F] to-[#3A7860] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-semibold text-stone-900 text-base pr-4">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#2C5F4F] flex-shrink-0 transition-transform duration-300 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openFaqIndex === index 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="px-5 pb-5 text-stone-700 leading-relaxed border-t border-stone-200 pt-4 ml-11">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relaterte produkter */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-stone-200 pt-12">
            <h2 className="text-3xl font-light text-stone-900 mb-8">
              Lignende produkter
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={handleRelatedProductCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

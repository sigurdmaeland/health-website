import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-500 overflow-hidden border border-stone-100">
      <Link href={`/produkter/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100">
        {/* Product Image */}
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F8F6F3] to-[#FBF9F6] opacity-50" />
            <span className="text-8xl relative z-10 group-hover:scale-110 transition-transform duration-500">📦</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.featured && (
            <span className="px-3 py-1.5 bg-[#C9A067] text-white text-xs font-bold rounded-full shadow-md">
              FEATURED
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="px-3 py-1.5 bg-[#2C5F4F] text-white text-xs font-bold rounded-full shadow-md">
              -{discountPercentage}%
            </span>
          )}
          {!product.in_stock && (
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
              UTSOLGT
            </span>
          )}
        </div>

        {/* Favoritt knapp */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton 
            productId={product.id}
            productName={product.name}
            productSlug={product.slug}
            productPrice={product.price}
            productImage={product.images?.[0] || ''}
            productDescription={product.description}
            size="md" 
          />
        </div>

        {/* Overlay ved hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-5">
        <Link href={`/produkter/${product.slug}`}>
          <p className="text-xs font-medium text-[#C9A067] mb-2 tracking-wide uppercase">{product.category}</p>
          <h3 className="font-semibold text-stone-900 mb-3 line-clamp-2 group-hover:text-[#2C5F4F] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Pris */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-stone-900">{product.price.toFixed(2)} kr</span>
          {product.compare_at_price && (
            <span className="text-sm text-stone-400 line-through">
              {product.compare_at_price.toFixed(2)} kr
            </span>
          )}
        </div>

        {/* Legg i handlekurv knapp */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.(product);
          }}
          disabled={!product.in_stock}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.in_stock
              ? 'gradient-primary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-stone-200 text-stone-500 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{product.in_stock ? 'Legg i handlekurv' : 'Utsolgt'}</span>
        </button>
      </div>
    </div>
  );
}

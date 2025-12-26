'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Package } from 'lucide-react';

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
  created_at: string;
}

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Er du sikker på at du vil slette "${name}"?`)) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== id));
      alert('Produkt slettet!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Kunne ikke slette produkt');
    }
  }

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-stone-900">Produkter</h1>
          <p className="text-stone-600 mt-1">
            Administrer alle produkter i butikken
          </p>
        </div>
        <Link
          href="/admin/produkter/ny"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nytt Produkt</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Søk etter produkter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
          >
            <option value="all">Alle kategorier</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-stone-600">
          Viser {filteredProducts.length} av {products.length} produkter
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 animate-pulse"
            >
              <div className="aspect-square bg-stone-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-stone-200 text-center">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-stone-900 mb-2">
            Ingen produkter funnet
          </h3>
          <p className="text-stone-600 mb-6">
            {searchTerm || categoryFilter !== 'all'
              ? 'Prøv å justere søkefiltrene'
              : 'Kom i gang ved å legge til ditt første produkt'}
          </p>
          <Link
            href="/admin/produkter/ny"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Legg til produkt</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-stone-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16 text-stone-300" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.featured && (
                    <span className="px-3 py-1 bg-[#C9A067] text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                  {!product.in_stock && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      Utsolgt
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-medium text-stone-900 mb-1 group-hover:text-[#2C5F4F] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#2C5F4F]">
                    {product.price.toFixed(2)} kr
                  </span>
                  {product.compare_at_price && (
                    <span className="text-sm text-stone-500 line-through">
                      {product.compare_at_price.toFixed(2)} kr
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-500 uppercase tracking-wide">
                  {product.category}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-stone-200">
                  <Link
                    href={`/admin/produkter/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="font-medium">Rediger</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

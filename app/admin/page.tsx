'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, FolderOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Hent produkter
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) throw productsError;

        // Hent kategorier
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) throw categoriesError;

        setStats({
          totalProducts: products?.length || 0,
          totalCategories: categories?.length || 0,
          featuredProducts: products?.filter((p) => p.featured).length || 0,
          outOfStock: products?.filter((p) => !p.in_stock).length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Totalt Produkter',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/produkter',
    },
    {
      title: 'Kategorier',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'from-amber-500 to-amber-600',
      href: '/admin/kategorier',
    },
    {
      title: 'Featured Produkter',
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/produkter',
    },
    {
      title: 'Utsolgt',
      value: stats.outOfStock,
      icon: Package,
      color: 'from-red-500 to-red-600',
      href: '/admin/produkter',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-stone-900 mb-2">Dashboard</h1>
        <p className="text-stone-600">
          Velkommen til Peersen & Co administrasjonspanel
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 animate-pulse"
            >
              <div className="h-12 w-12 bg-stone-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-stone-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-stone-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-[#C9A067] transition-colors" />
                </div>
                <p className="text-sm text-stone-600 mb-1">{card.title}</p>
                <p className="text-3xl font-semibold text-stone-900">{card.value}</p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 mb-4">
          Hurtighandlinger
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/produkter/ny"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-300 hover:border-[#2C5F4F] hover:bg-[#2C5F4F]/5 rounded-xl transition-all group"
          >
            <Package className="w-5 h-5 text-stone-600 group-hover:text-[#2C5F4F] transition-colors" />
            <span className="font-medium text-stone-700 group-hover:text-[#2C5F4F] transition-colors">
              Legg til nytt produkt
            </span>
          </Link>
          <Link
            href="/admin/kategorier"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-300 hover:border-[#C9A067] hover:bg-[#C9A067]/5 rounded-xl transition-all group"
          >
            <FolderOpen className="w-5 h-5 text-stone-600 group-hover:text-[#C9A067] transition-colors" />
            <span className="font-medium text-stone-700 group-hover:text-[#C9A067] transition-colors">
              Administrer kategorier
            </span>
          </Link>
          <Link
            href="/admin/produkter"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-300 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl transition-all group"
          >
            <TrendingUp className="w-5 h-5 text-stone-600 group-hover:text-blue-500 transition-colors" />
            <span className="font-medium text-stone-700 group-hover:text-blue-500 transition-colors">
              Se alle produkter
            </span>
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-br from-[#2C5F4F] to-[#1e4538] rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-light mb-3">Velkommen til Admin-panelet</h2>
        <p className="text-white/80 max-w-2xl">
          Her kan du administrere alle produkter, kategorier og innhold for Peersen & Co. 
          Bruk navigasjonen ovenfor for å komme i gang.
        </p>
      </div>
    </div>
  );
}

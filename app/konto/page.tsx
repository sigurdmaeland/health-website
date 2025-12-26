'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, Settings, MapPin, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function KontoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    orderCount: 0,
    favoriteCount: 0,
    addressCount: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    try {
      const [orders, favorites, addresses] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user?.id),
        supabase.from('user_favorites').select('id', { count: 'exact', head: true }).eq('user_id', user?.id),
        supabase.from('user_addresses').select('id', { count: 'exact', head: true }).eq('user_id', user?.id),
      ]);

      setStats({
        orderCount: orders.count || 0,
        favoriteCount: favorites.count || 0,
        addressCount: addresses.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Laster...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'Min profil', href: '/konto/profil', color: 'from-blue-500 to-blue-600' },
    { icon: Package, label: 'Mine ordrer', href: '/konto/ordrer', color: 'from-green-500 to-green-600', badge: stats.orderCount },
    { icon: Heart, label: 'Favoritter', href: '/konto/favoritter', color: 'from-red-500 to-red-600', badge: stats.favoriteCount },
    { icon: MapPin, label: 'Adressebok', href: '/konto/adresser', color: 'from-purple-500 to-purple-600', badge: stats.addressCount },
    { icon: Settings, label: 'Innstillinger', href: '/konto/innstillinger', color: 'from-gray-500 to-gray-600' },
    { icon: Shield, label: 'Sikkerhet', href: '/konto/sikkerhet', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-[#2C5F4F] to-[#3A7860] rounded-3xl p-8 md:p-12 text-white shadow-elegant">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light mb-2">
                  Velkommen tilbake!
                </h1>
                <p className="text-white/80 text-lg">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-stone-900">{stats.orderCount}</span>
            </div>
            <h3 className="text-sm font-medium text-stone-600">Totale bestillinger</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-stone-900">{stats.favoriteCount}</span>
            </div>
            <h3 className="text-sm font-medium text-stone-600">Favoritter</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-stone-900">{stats.addressCount}</span>
            </div>
            <h3 className="text-sm font-medium text-stone-600">Lagrede adresser</h3>
          </div>
        </div>

        {/* Menu Grid */}
        <div>
          <h2 className="text-2xl font-light text-stone-900 mb-6">Din konto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-lg hover:border-[#2C5F4F]/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-3 py-1 bg-[#2C5F4F] text-white text-sm font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-stone-900 group-hover:text-[#2C5F4F] transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Administrer dine {item.label.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

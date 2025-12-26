'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchProducts, setSearchProducts] = useState<any[]>([]);
  const [searchCategories, setSearchCategories] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products and categories from database
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchProducts([]);
      setSearchCategories([]);
      return;
    }

    const searchDatabase = async () => {
      setSearchLoading(true);
      try {
        // Search products
        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, slug, price, images, category')
          .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
          .limit(4);

        // Get unique categories from results
        const uniqueCategories = productsData
          ? Array.from(new Set(productsData.map(p => p.category)))
              .slice(0, 2)
              .map(cat => ({ name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-') }))
          : [];

        setSearchProducts(productsData || []);
        setSearchCategories(uniqueCategories);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchDatabase, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const hasResults = searchProducts.length > 0 || searchCategories.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produkter?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const navItems = [
    { name: 'Hjem', href: '/' },
    { name: 'Produkter', href: '/produkter' },
    { name: 'Kategorier', href: '/kategorier' },
    { name: 'Om oss', href: '/om-oss' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect border-b border-stone-200' 
        : 'bg-[#FAFAF8]'
    }`}>
      {/* Top bar - kun desktop */}
      <div className="hidden lg:block border-b border-stone-200 bg-[#2C5F4F] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5">
          <div className="flex items-center justify-between text-xs">
            <p className="flex items-center gap-2">
              <span className="font-medium">Gratis frakt</span>
              <span className="opacity-80">over 500 kr</span>
            </p>
            <div className="flex items-center gap-4">
              <a href="tel:+4712345678" className="hover:opacity-80 transition-opacity">
                +47 123 45 678
              </a>
              <span className="opacity-40">|</span>
              <a href="mailto:post@peersenco.no" className="hover:opacity-80 transition-opacity">
                post@peersenco.no
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-2xl lg:text-3xl font-light tracking-wider text-[#2C5F4F] group-hover:text-[#3A7860] transition-colors">
                PEERSEN
              </span>
              <span className="text-[10px] lg:text-xs tracking-[0.3em] text-[#C9A067] font-medium -mt-1">
                & COMPANY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-6 py-2.5 text-sm font-medium text-stone-700 hover:text-[#2C5F4F] hover:bg-stone-100 rounded-xl transition-all whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search with dropdown */}
            <div ref={searchRef} className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    placeholder="Søk produkter..."
                    className="w-48 sm:w-64 pl-10 pr-4 py-2.5 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-all text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={handleSearchIconClick}
                  className="p-2.5 hover:bg-stone-100 rounded-full transition-all group"
                  aria-label="Søk"
                >
                  <Search className="w-5 h-5 text-stone-600 group-hover:text-[#2C5F4F] transition-colors" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.length > 0 && isSearchOpen && (
                <div className="absolute top-full mt-2 w-96 bg-white rounded-2xl shadow-elegant border border-stone-200 py-2 z-50 max-h-[500px] overflow-y-auto">
                  {searchLoading ? (
                    <div className="px-6 py-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-sm text-stone-600">Søker...</p>
                    </div>
                  ) : hasResults ? (
                    <>
                      {/* Categories */}
                      {searchCategories.length > 0 && (
                        <div className="px-3 py-2">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide px-3 mb-2">Kategorier</p>
                          {searchCategories.map((category, idx) => (
                            <Link
                              key={idx}
                              href={`/kategorier/${category.slug}`}
                              onClick={() => {
                                setShowSearchResults(false);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 rounded-xl transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2C5F4F] to-[#3A7860] flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">{category.name.charAt(0)}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-stone-900">{category.name}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Products */}
                      {searchProducts.length > 0 && (
                        <div className="px-3 py-2">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide px-3 mb-2">Produkter</p>
                          {searchProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/produkter/${product.slug}`}
                              onClick={() => {
                                setShowSearchResults(false);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 rounded-xl transition-colors"
                            >
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F8F6F3] to-[#E5E5E5] flex-shrink-0 overflow-hidden relative">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-stone-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-900 truncate">{product.name}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-[#2C5F4F]">{product.price},-</p>
                                  <span className="text-xs text-stone-500">{product.category}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* View All Results */}
                      <div className="border-t border-stone-200 mt-2 pt-2 px-3">
                        <button
                          onClick={handleSearch}
                          className="w-full px-3 py-2.5 text-sm font-medium text-[#2C5F4F] hover:bg-[#2C5F4F]/5 rounded-xl transition-colors text-center"
                        >
                          Se alle resultater for "{searchQuery}"
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-stone-600">Ingen resultater</p>
                      <p className="text-xs text-stone-500 mt-1">Prøv et annet søkeord</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Account - Desktop */}
            {!loading && (
              <div className="hidden lg:block relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center gap-2 p-2.5 hover:bg-stone-100 rounded-full transition-all group"
                      aria-label="Min konto"
                    >
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </button>

                    {/* User Dropdown */}
                    {showUserDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserDropdown(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elegant border border-stone-200 py-2 z-50 animate-fade-in">
                          <div className="px-4 py-3 border-b border-stone-200">
                            <p className="text-sm font-semibold text-stone-900">{user.email}</p>
                            <p className="text-xs text-stone-500 mt-1">Innlogget</p>
                          </div>
                          
                          <Link
                            href="/konto"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            <User className="w-4 h-4 text-stone-600" />
                            <span className="text-sm font-medium text-stone-700">Min konto</span>
                          </Link>
                          
                          <Link
                            href="/konto/ordrer"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            <Package className="w-4 h-4 text-stone-600" />
                            <span className="text-sm font-medium text-stone-700">Mine ordrer</span>
                          </Link>
                          
                          <Link
                            href="/konto/favoritter"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-stone-600" />
                            <span className="text-sm font-medium text-stone-700">Favoritter</span>
                          </Link>
                          
                          <Link
                            href="/konto/innstillinger"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-stone-600" />
                            <span className="text-sm font-medium text-stone-700">Innstillinger</span>
                          </Link>
                          
                          <div className="border-t border-stone-200 mt-2 pt-2">
                            <button
                              onClick={() => {
                                signOut();
                                setShowUserDropdown(false);
                              }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                            >
                              <LogOut className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Logg ut</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-[#2C5F4F] hover:bg-stone-100 rounded-xl transition-all"
                  >
                    Logg inn
                  </button>
                )}
              </div>
            )}

            <Link 
              href="/handlekurv"
              className="relative p-2.5 hover:bg-stone-100 rounded-full transition-all group"
              aria-label="Handlekurv"
            >
              <ShoppingCart className="w-5 h-5 text-stone-600 group-hover:text-[#2C5F4F] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 gradient-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 hover:bg-stone-100 rounded-full transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Meny"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-stone-700" />
              ) : (
                <Menu className="w-6 h-6 text-stone-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-8 border-t border-stone-200 animate-fade-in mt-4">
            <div className="pt-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-6 py-4 text-base text-stone-700 hover:bg-stone-100 hover:text-[#2C5F4F] rounded-2xl transition-all font-medium border border-transparent hover:border-stone-200 hover:shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Account Links */}
              <div className="pt-4 mt-4 border-t border-stone-200">
                {user ? (
                  <>
                    <Link
                      href="/konto"
                      className="flex items-center gap-3 px-6 py-4 text-base text-stone-700 hover:bg-stone-100 hover:text-[#2C5F4F] rounded-2xl transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Min konto</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-6 py-4 text-base text-red-600 hover:bg-red-50 rounded-2xl transition-all font-medium w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logg ut</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-6 py-4 text-base text-stone-700 hover:bg-stone-100 hover:text-[#2C5F4F] rounded-2xl transition-all font-medium w-full text-left"
                  >
                    <User className="w-5 h-5" />
                    <span>Logg inn</span>
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </header>
  );
}

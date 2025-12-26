'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Cart } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
    setInitialized(true);
  }, [user]);

  // Save cart to localStorage for guests
  useEffect(() => {
    if (initialized && !user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user, initialized]);

  async function loadCartFromDatabase() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_carts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const items: CartItem[] = (data || []).map((item: any) => ({
        product: {
          id: item.product_id,
          name: item.product_name,
          slug: item.product_slug,
          description: item.product_description,
          price: item.product_price,
          originalPrice: item.product_compare_at_price || undefined,
          image: item.product_image,
          images: [item.product_image],
          category: item.product_category,
          brand: item.product_category,
          rating: 4.5,
          reviews: 0,
          inStock: item.product_in_stock ?? true
        },
        quantity: item.quantity
      }));

      setCart({
        items,
        total: calculateTotal(items)
      });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }

  async function syncCartToDatabase() {
    if (!user) return;

    try {
      // Clear existing cart in database
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', user.id);

      // Insert all items
      if (cart.items.length > 0) {
        const cartItems = cart.items.map(item => ({
          user_id: user.id,
          product_id: item.product.id,
          quantity: item.quantity
        }));

        await supabase
          .from('user_carts')
          .insert(cartItems);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });

    // Sync to database if user is logged in
    if (user) {
      try {
        const { data: existing } = await supabase
          .from('user_carts')
          .select('quantity')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single();

        if (existing) {
          await supabase
            .from('user_carts')
            .update({ quantity: existing.quantity + quantity })
            .eq('user_id', user.id)
            .eq('product_id', product.id);
        } else {
          await supabase
            .from('user_carts')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity,
              product_name: product.name,
              product_slug: product.slug,
              product_price: product.price,
              product_image: product.image || product.images?.[0],
              product_description: product.description,
              product_category: product.category,
              product_compare_at_price: product.originalPrice,
              product_in_stock: product.inStock ?? true
            });
        }
      } catch (error) {
        console.error('Error syncing to database:', error);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });

    // Sync to database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_carts')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (error) {
        console.error('Error removing from database:', error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });

    // Sync to database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_carts')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (error) {
        console.error('Error updating database:', error);
      }
    }
  };

  const clearCart = async () => {
    setCart({ items: [], total: 0 });

    // Clear from database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_carts')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error clearing cart from database:', error);
      }
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

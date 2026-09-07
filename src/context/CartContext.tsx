'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string; // unique item key: productId + size + color
  productId: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  image: string;
  price: number;
  salePrice?: number | null;
  size: string;
  color: string;
  colorHex?: string;
  quantity: number;
  maxStock: number;
}

interface CouponState {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  discountAmount: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  coupon: CouponState | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<CouponState | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('black_island_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('black_island_cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemId = `${newItem.productId}-${newItem.size}-${newItem.color}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + newItem.quantity,
          newItem.maxStock || 99
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { ...newItem, id: itemId }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const subtotal = cart.reduce((acc, item) => {
    const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const discount = coupon
    ? coupon.type === 'PERCENTAGE'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0;

  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code.trim())}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.success && data.coupon) {
        setCoupon({
          code: data.coupon.code,
          type: data.coupon.type,
          value: data.coupon.value,
          discountAmount: data.discount,
        });
        return { success: true, message: 'Coupon applied!' };
      }
      return { success: false, message: data.error || 'Invalid promo code' };
    } catch (err) {
      return { success: false, message: 'Failed to validate promo code' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        coupon,
        applyCoupon,
        removeCoupon,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

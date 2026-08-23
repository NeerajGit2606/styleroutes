"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export type CartLine = {
  product: Product;
  size: string;
  quantity: number;
};

export type OrderCustomer = { name: string; phone: string; address: string; city: string; state: string; pincode: string };

export type Order = {
  id: string;
  date: string;
  items: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: OrderCustomer;
};

type CartContextValue = {
  cart: CartLine[];
  liked: number[];
  orders: Order[];
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  toast: string | null;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  setQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleLike: (productId: number) => void;
  placeOrder: (customer: OrderCustomer, shipping: number) => Order;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [liked, setLiked] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // Load saved cart/wishlist once, when the app first mounts in the browser.
  // Not using a useState lazy-initializer here: that would run during
  // server-side render too (where localStorage doesn't exist), and even on
  // the client it would make the very first render already show saved data
  // while the server-rendered HTML showed none — a hydration mismatch.
  useEffect(() => {
    const savedCart = localStorage.getItem("styleroute_cart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedLiked = localStorage.getItem("styleroute_wishlist");
    if (savedLiked) setLiked(JSON.parse(savedLiked));

    const savedOrders = localStorage.getItem("styleroute_orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setHasLoadedStorage(true);
  }, []);

  // Re-save to localStorage every time the cart changes — but not before the
  // load effect above has actually run, otherwise this fires first (with the
  // still-empty initial cart) and wipes out whatever was saved from last time.
  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("styleroute_cart", JSON.stringify(cart));
  }, [cart, hasLoadedStorage]);

  // Same guard for the wishlist.
  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("styleroute_wishlist", JSON.stringify(liked));
  }, [liked, hasLoadedStorage]);

  // Same guard for past orders.
  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("styleroute_orders", JSON.stringify(orders));
  }, [orders, hasLoadedStorage]);

  const addToCart = (product: Product, size?: string, quantity = 1) => {
    const chosenSize = size ?? product.sizes[0] ?? "";
    setCart((items) => {
      const existingIndex = items.findIndex((line) => line.product.id === product.id && line.size === chosenSize);
      if (existingIndex !== -1) {
        return items.map((line, i) => (i === existingIndex ? { ...line, quantity: line.quantity + quantity } : line));
      }
      return [...items, { product, size: chosenSize, quantity }];
    });
    setToast(`${product.name} added to bag`);
  };

  // Auto-dismiss the "added to bag" toast a couple seconds after it appears.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const removeFromCart = (index: number) => {
    setCart((items) => items.filter((_, i) => i !== index));
  };

  const setQuantity = (index: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(index);
      return;
    }
    setCart((items) => items.map((line, i) => (i === index ? { ...line, quantity } : line)));
  };

  const clearCart = () => setCart([]);

  const toggleLike = (productId: number) => {
    setLiked((items) => (items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId]));
  };

  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const placeOrder = (customer: OrderCustomer, shipping: number): Order => {
    const order: Order = {
      id: `SR${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: cart,
      subtotal: total,
      shipping,
      total: total + shipping,
      customer,
    };
    setOrders((items) => [order, ...items]);
    clearCart();
    return order;
  };

  return (
    <CartContext.Provider
      value={{ cart, liked, orders, bagOpen, setBagOpen, toast, addToCart, removeFromCart, setQuantity, clearCart, toggleLike, placeOrder, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

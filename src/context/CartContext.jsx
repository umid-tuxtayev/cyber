import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  clearCartItems,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../services/checkoutApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const hasToken = () => !!localStorage.getItem("token");

  const refreshCart = async () => {
    if (!hasToken()) {
      setCartItems([]);
      return [];
    }

    setIsCartLoading(true);
    try {
      const cart = await getMyCart();
      const items = Array.isArray(cart?.items) ? cart.items : [];
      setCartItems(items);
      return items;
    } catch {
      setCartItems([]);
      return [];
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();

    const onAuthChanged = () => {
      refreshCart();
    };

    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  const addToCart = async (product) => {
    if (hasToken()) {
      const productId = product?.productId || product?.id;
      if (!productId) return;
      await addCartItem({
        productId,
        quantity: Math.max(1, Number(product?.quantity || 1)),
      });
      await refreshCart();
      return;
    }

    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prev, product];
    });
  };

  const updateQuantity = async (id, qty) => {
    if (hasToken()) {
      await updateCartItem({ itemId: id, quantity: Math.max(1, qty) });
      await refreshCart();
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const removeFromCart = async (id) => {
    if (hasToken()) {
      await removeCartItem(id);
      await refreshCart();
      return;
    }

    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = async () => {
    if (hasToken()) {
      await clearCartItems();
      await refreshCart();
      return;
    }
    setCartItems([]);
  };

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
      isCartLoading,
    }),
    [cartItems, isCartLoading]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

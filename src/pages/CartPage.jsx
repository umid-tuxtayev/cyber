"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const CartPage = () => {
  const [promoCode, setPromoCode] = useState("");
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white pt-20">
      <Header />

      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <NavLink to={'/'}>Home</NavLink> / Cart
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold mb-8">YOUR CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {item.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            Size: <span className="text-black dark:text-white">{item.size || "-"}</span>
                          </div>
                          <div>
                            Color: <span className="text-black dark:text-white">{item.color || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4">
                      <div className="text-xl font-bold">${item.price}</div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 sticky top-24 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-semibold">${Math.ceil(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Discount (-20%)</span>
                  <span className="font-semibold text-red-500">-${discount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                  <span className="font-semibold">${deliveryFee}</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${total.toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-4 px-5">
                <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-5 space-y-2 sm:space-y-0">
                  <input
                    type="text"
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 text-sm"
                  />
                  <button className="bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800">
                    Apply
                  </button>
                </div>

                <button onClick={() => navigate('/checkout/address')} className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 text-lg">
                  Go to Checkout →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;

"use client"

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import { useCart } from "../context/CartContext";
import { fetchBrands } from "../services/brandApi";

export default function ProductShowcase() {
  const [brands, setBrands] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [brandList, response] = await Promise.all([
          fetchBrands(),
          getProducts({
            queryKey: ["products", { limit: 40, skip: 0 }],
          }),
        ]);

        setBrands(Array.isArray(brandList) ? brandList.slice(0, 4) : []);

        const allProducts = response.products || [];

        const discounted = allProducts.filter(
          (item) => Number(item.compareAtPrice || 0) > Number(item.price || 0)
        );
        const base = discounted.length ? discounted : allProducts;
        const shuffled = [...base].sort(() => 0.5 - Math.random());
        const selectedDiscounts = shuffled.slice(0, 4);
        setDiscountProducts(selectedDiscounts);
      } catch (error) {
        console.error("Error fetching showcase data:", error);
      }
    };
    bootstrap();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-15 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => {
            const darkCard = index === 3;
            return (
              <div
                key={brand.id}
                className={`rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ${
                  darkCard
                    ? "bg-[#2e2e2e] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                }`}
              >
                <div className="flex flex-col items-start h-full">
                  <img
                    src={brand.logoUrl || "/placeholder.svg"}
                    alt={brand.name}
                    className="w-full h-36 object-contain mb-4"
                  />
                  <h3 className="text-xl font-medium mb-2">{brand.name}</h3>
                  <p
                    className={`text-xs mb-6 line-clamp-3 ${
                      darkCard ? "text-gray-300" : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {brand.slug}
                  </p>
                  <button
                    onClick={() => navigate("/shop")}
                    className={`mt-auto px-6 py-2 rounded text-sm font-medium transition-colors ${
                      darkCard
                        ? "border border-gray-300 text-white hover:bg-white hover:text-black"
                        : "border border-gray-300 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Discounts up to -30%</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 text-gray-800 h-[300px] dark:text-white rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <img src={product.thumbnail} alt={product.name} className="w-20 h-20 object-contain mb-4" />
                <h3 className="text-base h-10 font-semibold mb-3">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                    ${Math.floor(Number(product.compareAtPrice || product.price) || 0)}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await addToCart({
                        id: product.id,
                        name: product.name,
                        image: product.thumbnail,
                        price: product.price,
                        quantity: 1,
                        size: "M",
                        color: "Black",
                      });
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

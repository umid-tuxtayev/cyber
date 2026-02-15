import React, { useEffect, useState, useContext } from "react";
import { Heart, Star } from "lucide-react";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";
import iphone from "../assets/iphone.png";
import { ThemeContext } from "../context/ThemeContext";
import AppleShowcase from "../components/AppleShowcase";
import CategorySlider from "../components/CategorySlider";
import ProductShowcase from "../components/product-showcase";
import { motion } from "framer-motion";
import { useLikes } from "../context/LikeContext";

const Home = () => {
  const [limit, setLimit] = useState(10);
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const { likedItems, addToLikes, removeFromLikes } = useLikes();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const { data } = useQuery({
    queryKey: ["products", { limit, skip }],
    queryFn: getProducts,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.products) {
      setProducts((prev) => {
        const base = skip === 0 ? [] : prev;
        const merged = [...base, ...data.products];
        const seen = new Set();

        return merged.filter((item) => {
          const key = item?.id;
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });
    }
  }, [data, skip]);

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const hasCompareAtPrice = (product) =>
    product?.compareAtPrice !== null &&
    product?.compareAtPrice !== undefined &&
    product?.compareAtPrice !== "";

  const isLiked = (id) => likedItems.some((item) => item.id === id);

  const toggleLike = (event, product) => {
    event.stopPropagation();
    const liked = isLiked(product.id);

    if (liked) {
      removeFromLikes(product.id);
      return;
    }

    addToLikes({
      id: product.id,
      title: product.name || product.title,
      name: product.name || product.title,
      price: Number(product.price || 0),
      image: product.thumbnail || product.images?.[0] || "/placeholder.svg",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white mt-15">
<section className="relative overflow-hidden bg-[#211C24] text-white">
  {/* BACKGROUND EFFECTS */}
  <motion.div
    className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[120px] rounded-full z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.3 }}
    transition={{ duration: 2 }}
  />
  <motion.div
    className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-500 opacity-20 blur-[100px] rounded-full z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.3 }}
    transition={{ duration: 2.5 }}
  />

  {/* SETKA: TO‘G‘RI CHIZIQLAR */}
  <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

  {/* YOUR ORIGINAL CONTENT */}
  <div className="relative z-10 mx-auto max-w-[1240px] min-h-[520px] px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
    <div className="max-w-[620px]">
      <p className="text-[#8d8a92] font-semibold font-inter text-sm md:text-[34px] leading-none mb-4">
        Pro.Beyond.
      </p>
      <h1 className="text-[48px] md:text-[86px] lg:text-[96px] font-light font-inter leading-[0.9] tracking-[-0.02em] mb-5">
        <span className="font-inter">IPhone 14 </span>{" "}
        <span className="text-white font-bold">Pro</span>
      </h1>
      <p className="text-[#8e8b92] text-xs md:text-[20px] leading-[1.2] mb-8">
        Created to change everything for the better. For everyone
      </p>
      <Link
        to={"/shop"}
        className="inline-flex items-center justify-center w-[130px] h-[44px] border border-[#9f9ca5] text-white text-sm md:text-base rounded-md hover:bg-white hover:text-black transition"
      >
        Shop Now
      </Link>
    </div>
    <div className="relative mt-12 md:mt-0 self-end">
      <motion.div
        className="absolute top-18 -left-8 w-72 h-72 bg-pink-500 blur-3xl rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      />
      <img
        src={iphone}
        alt="iPhone"
        className="relative z-10 w-[300px] md:w-[420px] lg:w-[470px] object-contain md:translate-y-4 lg:translate-y-8"
      />
    </div>
  </div>
</section>


      <AppleShowcase />
      <CategorySlider />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative group dark:border-gray-500 dark:border rounded-[10px] p-6 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 bg-[#F6F6F6] dark:bg-gray-800"
              >
                <button
                  type="button"
                  onClick={(event) => toggleLike(event, product)}
                  className={`absolute right-4 top-4 z-20 rounded-full p-2 transition ${
                    isLiked(product.id)
                      ? "text-red-500 bg-red-50"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  aria-label="Toggle like"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked(product.id) ? "fill-red-500" : "fill-none"
                    }`}
                  />
                </button>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                  {product.images && product.images.length > 0 ? (
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={10}
                      className="w-full h-64"
                    >
                      {product.images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-64 object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      Rasm yo‘q
                    </div>
                  )}
                </div>

                <h4 className="font-semibold mb-2">{product.name}</h4>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.rating}/5
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">$ {product.price}</span>
                  {hasCompareAtPrice(product) && (
                    <span className="text-gray-500 line-through dark:text-gray-400">
                      ${Number(product.compareAtPrice || 0)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View All
            </button>
          </div>
        </div>
      </section>

      <ProductShowcase />
    </div>
  );
};

export default Home;

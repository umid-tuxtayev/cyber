import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsCategory } from "../services/api";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Gamepad,
  Headphones,
  Laptop,
  Smartphone,
  Watch,
} from "lucide-react";

const fallbackIcons = [
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Laptop,
  Gamepad,
];

const CategorySlider = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["home-categories"],
    queryFn: getProductsCategory,
  });

  return (
    <div className="py-10 px-4 bg-[#f6f6f6] dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl md:text-[30px] font-semibold dark:text-white">
            Browse By Category
          </h2>
          <div className="flex items-center gap-3">
            <button className="category-prev w-7 h-7 flex items-center justify-center text-black dark:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="category-next w-7 h-7 flex items-center justify-center text-black dark:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Swiper
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          navigation={{
            nextEl: ".category-next",
            prevEl: ".category-prev",
          }}
          modules={[Navigation]}
          className="category-swiper"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <div className="bg-[#eaeaea] dark:bg-gray-800 rounded-xl p-4 min-h-[106px] animate-pulse" />
                </SwiperSlide>
              ))
            : categories.map((cat, index) => {
                const Icon = fallbackIcons[index % fallbackIcons.length];
                return (
                  <SwiperSlide key={cat.id || index}>
                    <NavLink
                      to="/shop"
                      className="bg-[#eaeaea] dark:bg-gray-800 rounded-xl p-4 min-h-[106px] flex flex-col items-center justify-center text-center hover:bg-[#dfdfdf] dark:hover:bg-gray-700 transition"
                    >
                      <div className="mb-3">
                        {cat.iconUrl ? (
                          <img
                            src={cat.iconUrl}
                            alt={cat.name}
                            className="w-7 h-7 object-contain"
                          />
                        ) : (
                          <Icon className="w-7 h-7" />
                        )}
                      </div>
                      <p className="text-sm font-medium dark:text-white">
                        {cat.name}
                      </p>
                    </NavLink>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySlider;

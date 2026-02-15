import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
  Moon,
  Sun,
  Globe,
  LogOut,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Badge from "@mui/material/Badge";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { useLikes } from "../context/LikeContext";
import ResponsiveSearch from "./ResponsiveSearch";
import { useAuth } from "../context/AuthContext";
import { searchProducts } from "../services/api";

const Header = () => {
  const { likedItems } = useLikes();
  const likedCount = likedItems.length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const inputRef = useRef();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const controllerRef = useRef();
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const sidebarRef = useRef();
  const { cartItems } = useCart();
  const totalCount = cartItems.length;
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsProfileSidebarOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    if (isProfileSidebarOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileSidebarOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileSidebarOpen(false);
  };

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchResults = async () => {
      try {
        const data = await searchProducts(query);
        setResults(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query]);

  return (
    <header className="border-b fixed w-full top-0 z-50 bg-white dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="font-bold text-xl">
          <NavLink to="/">cyber</NavLink>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-80">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Qidirish..."
            className="bg-transparent outline-none flex-1 text-sm text-black dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length > 0 && (
            <div className="absolute z-50 mt-72 left-50 w-72 sm:w-96 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <span className="text-sm">{item.name || item.title}</span>
                  <span className="text-sm font-medium">${item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden lg:flex space-x-8">
          <NavLink
            to="/"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            Contact
          </NavLink>
          <NavLink
            to="/blog"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            Blog
          </NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="lg:hidden p-2">
            <ResponsiveSearch />
          </div>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/likes"
                className="p-2 dark:hover:bg-gray-600 hover:bg-gray-100 rounded-md"
              >
                <Badge badgeContent={likedCount} color="secondary">
                  <Heart className="h-5 w-5" />
                </Badge>
              </NavLink>
              <NavLink
                to="/cart"
                className="p-2 dark:hover:bg-gray-600 hover:bg-gray-100 rounded-md"
              >
                <Badge badgeContent={totalCount} color="secondary">
                  <ShoppingCart className="h-5 w-5" />
                </Badge>
              </NavLink>
              <button
                onClick={() => setIsProfileSidebarOpen(true)}
                className="p-2 dark:hover:bg-gray-600 hover:bg-gray-100 rounded-md"
              >
                <User className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 dark:hover:bg-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div
            ref={sidebarRef}
            className="relative w-80 bg-white dark:bg-gray-900 h-full z-50 text-black dark:text-white"
          >
            <div className="flex justify-between p-4 border-b border-gray-300 dark:border-gray-700">
              <div className="text-xl font-bold">cyber</div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4 space-y-4">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg"
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg"
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg"
              >
                Contact Us
              </NavLink>
              <NavLink
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg"
              >
                Blog
              </NavLink>
            </nav>
          </div>
        </div>
      )}

      {isProfileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end transition-all">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300" />

          <div
            ref={sidebarRef}
            className="relative w-80 bg-white dark:bg-gray-900 text-black dark:text-white h-full p-6 shadow-xl transition-transform duration-300 transform translate-x-0"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Profile</h2>
              <button onClick={() => setIsProfileSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/orders");
                  setIsProfileSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                My Orders
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setIsProfileSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/categories");
                      setIsProfileSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Admin Categories
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/products");
                      setIsProfileSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Admin Products
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/orders");
                      setIsProfileSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Admin Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/brands");
                      setIsProfileSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Admin Brands
                  </button>
                </>
              )}

              <div className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="flex items-center gap-2">
                  <Moon className="h-4 w-4" /> Dark Mode
                </span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full"
                >
                  {isDarkMode ? "Off" : "On"}
                </button>
              </div>

              <div className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Language
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-200 dark:bg-gray-700 text-sm rounded px-2 py-1"
                >
                  <option value="en">EN</option>
                  <option value="uz">UZ</option>
                  <option value="ru">RU</option>
                </select>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../services/api";

const ResponsiveSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef();
  const controllerRef = useRef();

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

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
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 dark:text-gray-300"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 w-72 sm:w-96">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Qidirish..."
            className="bg-transparent outline-none flex-1 text-sm text-black dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-72 sm:w-96 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
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
  );
};

export default ResponsiveSearch;

import { createContext, useContext, useState, useEffect } from "react";

const LikeContext = createContext();
const LIKES_STORAGE_KEY = "likedItems";

const readLikedItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const LikeProvider = ({ children }) => {
  const [likedItems, setLikedItems] = useState(readLikedItems);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedItems));
    } catch {
      // ignore storage write failures
    }
  }, [likedItems]);

  const addToLikes = (item) => {
    setLikedItems((prev) => {
      if (prev.some((liked) => liked.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromLikes = (id) => {
    setLikedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <LikeContext.Provider value={{ likedItems, addToLikes, removeFromLikes }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikes = () => useContext(LikeContext);

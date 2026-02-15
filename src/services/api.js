import axios from "axios";
import { authRefresh, extractAccessToken } from "./authApi";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://cyber-ecommerce-backend-szwn.onrender.com";

export const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = authRefresh()
      .then((payload) => {
        const refreshedToken = extractAccessToken(payload);
        if (!refreshedToken) {
          throw new Error("Missing access token in refresh response");
        }
        localStorage.setItem("token", refreshedToken);
        window.dispatchEvent(new Event("auth-changed"));
        return refreshedToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("auth-changed"));
      return Promise.reject(refreshError?.response ? refreshError : error);
    }
  }
);

const normalizeCategoryList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const mapProduct = (item) => ({
  ...item,
  title: item.name,
  rating: Number(item.ratingAverage || 0),
  thumbnail: item.images?.[0]?.imageUrl || "/placeholder.svg",
  images: (item.images || []).map((img) => img.imageUrl),
});

export const getProducts = async ({ queryKey }) => {
  const [, { limit = 12, skip = 0 }] = queryKey;
  const page = Math.floor(skip / limit) + 1;
  const res = await api.get(`/products?page=${page}&limit=${limit}`);

  const data = Array.isArray(res.data?.data) ? res.data.data : [];
  return {
    products: data.map(mapProduct),
    meta: res.data?.meta || {},
  };
};

export const getSingleProduct = async ({ queryKey }) => {
  const [, id] = queryKey;
  const res = await api.get(`/products/${id}`);
  return mapProduct(res.data);
};

export const getProductsCategory = async () => {
  const res = await api.get("/categories");
  return normalizeCategoryList(res.data);
};

export const searchProducts = async (query) => {
  const res = await api.get("/products?page=1&limit=100");
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  const keyword = query.trim().toLowerCase();
  return list
    .filter((p) => p.name?.toLowerCase().includes(keyword))
    .slice(0, 15)
    .map(mapProduct);
};

const toProductFormData = (payload) => {
  const formData = new FormData();
  const fields = [
    "name",
    "slug",
    "sku",
    "description",
    "price",
    "compareAtPrice",
    "currency",
    "stock",
    "isActive",
    "isFeatured",
    "categoryId",
    "brandId",
  ];

  fields.forEach((field) => {
    const value = payload[field];
    if (value !== undefined && value !== null && value !== "") {
      formData.append(field, String(value));
    }
  });

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      if (file) formData.append("images", file);
    });
  }

  return formData;
};

export const createProduct = async (payload) => {
  const res = await api.post("/products", toProductFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async ({ id, ...payload }) => {
  const res = await api.put(`/products/${id}`, toProductFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

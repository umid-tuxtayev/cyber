import axios from "axios";
import { authRefresh, extractAccessToken } from "./authApi";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://cyber-ecommerce-backend-szwn.onrender.com";

const brandApi = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

brandApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

const refreshBrandToken = async () => {
  if (!refreshPromise) {
    refreshPromise = authRefresh()
      .then((payload) => {
        const token = extractAccessToken(payload);
        if (!token) {
          throw new Error("Missing access token in refresh response");
        }
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("auth-changed"));
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

brandApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await refreshBrandToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return brandApi(originalRequest);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("auth-changed"));
      return Promise.reject(error);
    }
  }
);

const normalizeBrands = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const toBrandFormData = ({ name, slug, logo }) => {
  const formData = new FormData();

  if (name !== undefined && name !== null) {
    formData.append("name", name);
  }
  if (slug !== undefined && slug !== null) {
    formData.append("slug", slug);
  }
  if (logo) {
    formData.append("logo", logo);
  }

  return formData;
};

export const fetchBrands = async () => {
  const res = await brandApi.get("/brands");
  return normalizeBrands(res.data);
};

export const fetchBrandById = async (id) => {
  const res = await brandApi.get(`/brands/${id}`);
  return res.data?.data || res.data;
};

export const createBrand = async (payload) => {
  const formData = toBrandFormData(payload);
  const res = await brandApi.post("/brands", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data || res.data;
};

export const updateBrand = async ({ id, ...payload }) => {
  const formData = toBrandFormData(payload);

  try {
    const res = await brandApi.put(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data || res.data;
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 404 && status !== 405) {
      throw error;
    }

    const res = await brandApi.patch(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data || res.data;
  }
};

export const deleteBrand = async (id) => {
  const res = await brandApi.delete(`/brands/${id}`);
  return res.data?.data || res.data;
};

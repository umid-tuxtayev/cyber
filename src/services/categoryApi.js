import axios from "axios";
import { authRefresh, extractAccessToken } from "./authApi";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const categoryApi = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

categoryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

const refreshCategoryToken = async () => {
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

categoryApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await refreshCategoryToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return categoryApi(originalRequest);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("auth-changed"));
      return Promise.reject(error);
    }
  }
);

const normalizeCategories = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const toFormData = ({ name, slug, parentId, icon }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("slug", slug);
  if (parentId) {
    formData.append("parentId", parentId);
  }
  if (icon) {
    formData.append("icon", icon);
  }
  return formData;
};

export const fetchCategories = async () => {
  const res = await categoryApi.get("/categories");
  return normalizeCategories(res.data);
};

export const createCategory = async (payload) => {
  const formData = toFormData(payload);
  const res = await categoryApi.post("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateCategory = async ({ id, ...payload }) => {
  const formData = toFormData(payload);
  try {
    const res = await categoryApi.patch(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 404 && status !== 405) {
      throw error;
    }
    const res = await categoryApi.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
};

export const deleteCategory = async (id) => {
  const res = await categoryApi.delete(`/categories/${id}`);
  return res.data;
};

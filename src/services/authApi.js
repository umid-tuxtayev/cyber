import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const authApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const unwrapAuthPayload = (payload) => payload?.data ?? payload;

export const extractAccessToken = (payload) => {
  const normalized = unwrapAuthPayload(payload);
  return (
    normalized?.accessToken ||
    normalized?.token ||
    normalized?.access_token ||
    normalized?.tokens?.accessToken ||
    normalized?.tokens?.access ||
    normalized?.auth?.accessToken ||
    null
  );
};

export const extractUserFromAuth = (payload) => {
  const normalized = unwrapAuthPayload(payload);
  return normalized?.user || normalized?.profile || null;
};

export const authRegister = async (payload) => {
  const res = await authApi.post("/auth/register", payload);
  return unwrapAuthPayload(res.data);
};

export const authCreateAdmin = async (payload) => {
  const res = await authApi.post("/auth/create-admin", payload);
  return unwrapAuthPayload(res.data);
};

export const authVerifyEmail = async (payload) => {
  const res = await authApi.post("/auth/verify-email", payload);
  return unwrapAuthPayload(res.data);
};

export const authResendVerification = async (payload) => {
  const res = await authApi.post("/auth/resend-verification", payload);
  return unwrapAuthPayload(res.data);
};

export const authLogin = async (payload) => {
  const res = await authApi.post("/auth/login", payload);
  return unwrapAuthPayload(res.data);
};

export const authForgotPassword = async (payload) => {
  const res = await authApi.post("/auth/forgot-password", payload);
  return unwrapAuthPayload(res.data);
};

export const authResetPassword = async ({ email, ...payload }) => {
  const res = await authApi.post(`/auth/reset-password?email=${encodeURIComponent(email)}`, payload);
  return unwrapAuthPayload(res.data);
};

export const authChangePassword = async (payload) => {
  const res = await authApi.post("/auth/change-password", payload);
  return unwrapAuthPayload(res.data);
};

export const authRefresh = async () => {
  const res = await authApi.post("/auth/refresh");
  return unwrapAuthPayload(res.data);
};

export const authLogout = async () => {
  const res = await authApi.post("/auth/logout");
  return unwrapAuthPayload(res.data);
};

export const authMe = async () => {
  const res = await authApi.get("/auth/me");
  return unwrapAuthPayload(res.data);
};

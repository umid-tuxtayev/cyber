"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin.js";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { authRefresh, extractAccessToken, extractUserFromAuth } from "../services/authApi";

const isUnverifiedError = (err) => {
  const raw = err?.response?.data;
  const blob = JSON.stringify(raw || "").toLowerCase();
  return (
    blob.includes("email is not verified") ||
    blob.includes("not verified") ||
    blob.includes("verify") ||
    blob.includes("verification")
  );
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate: loginUser, isPending, error } = useLogin();
  

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData, {
      onSuccess: async (payload) => {
        let token = extractAccessToken(payload);
        let user = extractUserFromAuth(payload);

        if (!token) {
          try {
            const refreshPayload = await authRefresh();
            token = extractAccessToken(refreshPayload);
            user = user || extractUserFromAuth(refreshPayload);
          } catch {
            // Cookie refresh failed, handled below.
          }
        }

        if (!token) {
          toast.error("Kirish amalga oshmadi. Qayta urinib ko'ring.");
          return;
        }

        user =
          user ||
          payload?.user || {
            id: payload?.id,
            email: payload?.email,
            username: payload?.username,
            role: payload?.role,
          };

        const role = (user?.role || payload?.role || "").toLowerCase();
        login(token, user);
        toast.success("Muvaffaqiyatli tizimga kirdingiz.");

        if (role === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        navigate("/");
      },
      onError: (err) => {
        if (isUnverifiedError(err)) {
          toast.info("Email tasdiqlanmagan. Tasdiqlash sahifasiga yo'naltirildi.");
          localStorage.setItem("pending_verify_email", formData.email);
          navigate("/verify-email", { state: { email: formData.email }, replace: true });
          return;
        }

        toast.error(err?.response?.data?.message || "Login failed.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <div className="text-center pb-8 pt-12 bg-gradient-to-b from-white to-blue-50/30">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Sign In</h1>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-12 h-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none bg-gray-50/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="0lelplR"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full pl-12 pr-12 h-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none bg-gray-50/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && !isUnverifiedError(error) && (
                <div className="text-red-600 text-sm">
                  {error.response?.data?.message || "Login failed."}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all mt-8"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center pb-8 bg-gradient-to-t from-blue-50/30 to-white">
            <p className="text-gray-600 text-base">
              No account yet? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">Create One.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

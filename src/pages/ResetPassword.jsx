import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authResetPassword } from "../services/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryEmail = params.get("email") || "";
  const [email, setEmail] = useState(queryEmail);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const resetMutation = useMutation({
    mutationFn: authResetPassword,
    onSuccess: () => {
      setError("");
      setMessage("");
      setToken("");
      setNewPassword("");
      navigate("/login", { state: { email }, replace: true });
    },
    onError: (err) => {
      setMessage("");
      setError(err?.response?.data?.message || "Reset failed.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email || !token || !newPassword) {
      setError("Email, token and new password are required.");
      return;
    }
    resetMutation.mutate({ email, token, newPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 py-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter token from email and set a new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Reset token / OTP code"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-semibold disabled:opacity-60"
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Back to <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

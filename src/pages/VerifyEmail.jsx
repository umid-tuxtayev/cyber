import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authResendVerification, authVerifyEmail } from "../services/authApi";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    location.state?.email || localStorage.getItem("pending_verify_email") || "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verifyMutation = useMutation({
    mutationFn: authVerifyEmail,
    onSuccess: () => {
      setError("");
      setMessage("Email verified. You can log in now.");
      localStorage.removeItem("pending_verify_email");
      setTimeout(() => navigate("/login"), 600);
    },
    onError: (err) => {
      setMessage("");
      setError(err?.response?.data?.message || "Verification failed.");
    },
  });

  const resendMutation = useMutation({
    mutationFn: authResendVerification,
    onSuccess: () => {
      setError("");
      setMessage("New OTP code sent.");
    },
    onError: (err) => {
      setMessage("");
      setError(err?.response?.data?.message || "Resend failed.");
    },
  });

  const handleVerify = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email || !code) {
      setError("OTP code is required.");
      return;
    }
    verifyMutation.mutate({ email, code });
  };

  const handleResend = () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Email is required to resend code.");
      return;
    }
    resendMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 py-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Verify Email</h1>
        <p className="text-sm text-gray-600 mb-6">Enter OTP code sent to your email.</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="OTP code"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-semibold disabled:opacity-60"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="w-full mt-3 border border-blue-600 text-blue-700 rounded-2xl py-3 font-semibold disabled:opacity-60"
        >
          {resendMutation.isPending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Back to <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
        {!email && (
          <p className="mt-3 text-xs text-red-600 text-center">
            Email topilmadi. Login yoki registerdan qayta kiring.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

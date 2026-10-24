import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, X, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { closeLoginModal, loginUser } from "../features/auth/authSlice";

export default function LoginModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoginModalOpen, loginModalMessage, loading, error } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isLoginModalOpen) {
        dispatch(closeLoginModal());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, dispatch]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      // On success, modal automatically closes via Redux
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err?.detail || "Invalid email or password. Please try again."
      );
    }
  };

  const handleNavigateToFullLogin = () => {
    dispatch(closeLoginModal());
    navigate("/login");
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dispatch(closeLoginModal());
        }
      }}
    >
      <div className="relative w-full max-w-md bg-gray-900/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10 text-white backdrop-blur-xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => dispatch(closeLoginModal())}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-purple-500/25 mb-3.5">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white mb-1.5">
            Sign In Required
          </h3>
          <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
            {loginModalMessage ||
              "Please log in or create an account to perform this store activity."}
          </p>
        </div>

        {/* Error Notice */}
        {(formError || error) && (
          <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
            {formError || (typeof error === "string" ? error : error?.detail || "Authentication failed")}
          </div>
        )}

        {/* Inline Quick Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 pl-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800/80 border border-gray-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800/80 border border-gray-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 pl-9 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>Sign In & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links & Navigation */}
        <div className="mt-5 pt-4 border-t border-gray-800 flex flex-col gap-2.5 text-center">
          <p className="text-xs text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={handleNavigateToFullLogin}
              className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline underline-offset-2 ml-1"
            >
              Sign Up for Free
            </button>
          </p>

          <button
            onClick={() => dispatch(closeLoginModal())}
            className="text-[11px] text-gray-500 hover:text-gray-400 transition-colors cursor-pointer"
          >
            Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
}

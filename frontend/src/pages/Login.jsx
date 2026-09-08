import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MapPin, Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) {
          navigate("/verify-email", { state: { email: data.email } });
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      // Use auth context to update login state
      login(data.user, data.token);

      // Navigate based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "registrar") {
        navigate("/registrar");
      } else if (data.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/my-enrollments");
      }
    } catch (err) {
      const msg = err.message || "";
      setError(msg || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001840] via-[#102A71] to-[#001840] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="bg-[#F5C400] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-[#001840]" />
            </div>
            <div className="text-left">
              <span className="font-bold text-2xl tracking-wide text-white">
                GabAI
              </span>
              <p className="text-xs text-[#FFDC5F] leading-none tracking-wider">
                Eastern Mindoro College
              </p>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">
            Welcome Back!
          </h1>
          <p className="text-sm text-[#FFDC5F]">Sign in to continue your journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFDF0] rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-[#F5C400]/20">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#001840] font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#102A71]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[#001840] font-semibold"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#102A71]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#102A71] hover:text-[#001840] transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#102A71] text-[#102A71] focus:ring-[#102A71]"
                />
                <span className="text-sm text-[#001840]">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#102A71] hover:text-[#001840] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#102A71] to-[#001840] hover:from-[#001840] hover:to-[#102A71] text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#001840]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#102A71] hover:text-[#001840] font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-[#FFDC5F] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
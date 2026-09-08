import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MapPin, Eye, EyeOff, UserPlus, Mail, Lock, User, Phone, AlertCircle, Loader2, CheckCircle, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";

export function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  // Password requirement checks
  const pwRules = {
    length:    formData.password.length >= 12,
    uppercase: /[A-Z]/.test(formData.password),
    number:    /[0-9]/.test(formData.password),
  };
  const pwValid = Object.values(pwRules).every(Boolean);
  const showRules = formData.password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.fullName.trim()) { setError("Full name is required."); return; }
    if (formData.fullName.trim().length > 100) { setError("Name must be 100 characters or less."); return; }
    if (!formData.email.trim()) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError("Please enter a valid email address."); return; }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!pwValid) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setRegisteredEmail(formData.email);
      setRegistered(true);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001840] via-[#102A71] to-[#001840] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#FFFDF0] rounded-2xl shadow-2xl p-8 border-2 border-[#F5C400]/20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#001840] mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-2">We sent a verification link to:</p>
            <p className="font-semibold text-[#102A71] mb-4">{registeredEmail}</p>
            <p className="text-sm text-gray-500 mb-6">Click the link in the email to verify your account. The link expires in 24 hours.</p>
            <Link to="/login" className="block w-full py-3 bg-[#102A71] text-white rounded-xl font-semibold hover:bg-[#001840] transition-all">
              Go to Login
            </Link>
            <button
              onClick={async () => {
                try {
                  await fetch("http://localhost:3000/api/auth/resend-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: registeredEmail })
                  });
                  alert("Verification email resent!");
                } catch (_) {}
              }}
              className="mt-3 text-sm text-[#102A71] hover:underline"
            >
              Resend verification email
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001840] via-[#102A71] to-[#001840] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
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
            Create Your Account
          </h1>
          <p className="text-sm text-[#FFDC5F]">
            Join GabAI to navigate your admission journey
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-[#FFFDF0] rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-[#F5C400]/20">
          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#001840] font-semibold">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#102A71]" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid sm:grid-cols-2 gap-5">
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
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#001840] font-semibold">
                  Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#102A71]" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#001840] font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#102A71]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 pr-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#102A71] hover:text-[#001840] transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#001840] font-semibold">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#102A71]" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-11 pr-11 h-12 border-[#102A71]/30 focus:border-[#102A71] focus:ring-[#102A71] text-base"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#102A71] hover:text-[#001840] transition-colors"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            {showRules && (
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 px-1">
                {[
                  { met: pwRules.length,    label: "At least 12 characters" },
                  { met: pwRules.uppercase, label: "1 uppercase letter" },
                  { met: pwRules.number,    label: "1 number" },
                ].map(({ met, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${met ? "bg-green-500" : "bg-gray-300"}`}>
                      {met
                        ? <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        : <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      }
                    </span>
                    <span className={`text-xs transition-colors ${met ? "text-green-700 font-medium" : "text-gray-500"}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-[#102A71] text-[#102A71] focus:ring-[#102A71] mt-0.5 shrink-0"
              />
              <label htmlFor="terms" className="text-sm text-[#001840] leading-tight">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[#102A71] hover:text-[#001840] font-semibold transition-colors"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-[#102A71] hover:text-[#001840] font-semibold transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#001840]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#102A71] hover:text-[#001840] font-semibold transition-colors"
              >
                Sign in here
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
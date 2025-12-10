import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginCard = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { userLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await userLogin(formData);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="bg-white rounded-md w-100 shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 text-sm">Sign in to your Stock account</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all bg-gray-50/50"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <a
              href="#"
              className="text-sm text-[#db002f] hover:text-[#a60024] font-medium transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all pr-12 bg-gray-50/50"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#db002f] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#a60024] focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      {/* Sign Up Link */}
      <div className="text-center ">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-[#db002f] hover:text-[#a60024] font-semibold transition-colors underline-offset-2 hover:underline"
          >
            contact an admin
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
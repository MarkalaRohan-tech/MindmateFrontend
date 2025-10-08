import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { SuccessToast, ErrorToast } from "../Utils/ReactToast";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData.email, formData.password);
      console.log("Login response:", res);

      if (res.token) {
        toast(<SuccessToast message="Logged in successfully" />);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast(<ErrorToast message={res.message || "Invalid credentials"} />);
      }
    } catch (error) {
      toast(<ErrorToast message="Login failed" />);
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-[url(/buddhaPot.png)] md:bg-[url(/buddha.png)] w-full min-h-screen bg-cover bg-left xl:bg-center flex justify-center items-center p-4">
      <div className="rounded-3xl w-full max-w-md bg-white/90 backdrop-blur-sm p-6 md:p-8 shadow-2xl my-4">
        <h2 className="text-2xl md:text-4xl mb-4 md:mb-6 text-orange-400 text-center font-bold">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full text-black pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-gray-600">
              Enter a valid email address
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                minLength="8"
                className="w-full text-black pl-10 pr-10 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 cursor-pointer h-4" />
                ) : (
                  <Eye className="w-4 cursor-pointer h-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-600">At least 8 characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              Login
            </button>

            <p className="text-gray-700">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-orange-400 font-semibold hover:text-orange-500 underline"
              >
                Register
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;

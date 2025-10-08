import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { SuccessToast, ErrorToast } from "../Utils/ReactToast";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(
        formData.fullname,
        formData.email,
        formData.password,
        formData.username,
        formData.phone
      );

      if (res.status === 201) {
        toast(<SuccessToast message="Registered & logged in successfully!" />);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast(<ErrorToast message={res.message || "Registration failed"} />);
      }
    } catch (error) {
      toast(<ErrorToast message="Registration failed" />);
      console.error("Register error:", error);
    }
  };

  return (
    <div className="bg-[url(/buddhaPot.png)] md:bg-[url(/buddha.png)] w-full min-h-screen bg-cover bg-left xl:bg-center flex justify-center items-center p-4">
      <div className="rounded-3xl w-full max-w-5xl bg-white/90 backdrop-blur-sm p-6 md:p-8 shadow-2xl my-4">
        <h2 className="text-2xl md:text-4xl mb-4 md:mb-6 text-orange-400 text-center font-bold">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column - Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-400 text-center">
                Personal Details
              </h3>

              {/* Full Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                    pattern="[A-Za-z][A-Za-z0-9\- .]{2,29}"
                    minLength="3"
                    maxLength="30"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  3-30 chars (letters, numbers, dash, space, dot)
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Enter a valid email
                </p>
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone"
                    pattern="[0-9]{10}"
                    minLength="10"
                    maxLength="10"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors tabular-nums"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">10 digits</p>
              </div>
            </div>

            {/* Right Column - Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-400 text-center">
                Account Credentials
              </h3>

              {/* Username */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Username"
                    pattern="[A-Za-z][A-Za-z0-9\-]{2,29}"
                    minLength="3"
                    maxLength="30"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  3-30 chars (letters, numbers, dash)
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    minLength="8"
                    className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
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
                <p className="mt-1 text-xs text-gray-600">
                  At least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm Password"
                    minLength="8"
                    className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 cursor-pointer h-4" />
                    ) : (
                      <Eye className="w-4 cursor-pointer h-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Must match password
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full cursor-pointer md:w-1/2 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Register
            </button>

            <p className="text-gray-700">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-orange-400 font-semibold hover:text-orange-500 underline"
              >
                Login
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

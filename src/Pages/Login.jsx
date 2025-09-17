import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { SuccessToast, ErrorToast } from "../Utils/ReactToast";
import { toast } from "react-toastify";

const LoginRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    <div className="bg-[url(/buddhaPot.png)] md:bg-[url(/buddha.png)] w-full h-screen bg-cover bg-left xl:bg-center flex justify-center items-center">
      <div className="rounded-2xl w-[90vw] lg:w-3/4 xl:w-1/2 h-auto bg-[rgba(255,255,255,0.6)] p-8 shadow-2xl">
        <h2 className="text-3xl mb-8 text-black text-center font-bold">
          Login
        </h2>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center items-center gap-4"
        >
          {/* Email */}
          <label className="input validator w-full md:w-1/2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </label>
          <p className="validator-hint text-sm text-gray-600">
            <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Enter a
            valid email
          </p>

          {/* Password */}
          <label className="input validator w-full md:w-1/2">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              minLength="8"
              title="Password must be at least 8 characters"
            />
          </label>
          <p className="validator-hint text-sm text-gray-600">
            Password must be at least 8 characters
          </p>

          {/* Submit Button */}
          <div className="flex flex-col justify-center items-center w-full">
            <button
              type="submit"
              className="mt-4 py-2 px-6 rounded-xl w-1/3 cursor-pointer bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <br />
            <p className="text-black">
              Don&apos;t have an account?{" "}
              <NavLink to="/register" style={{ textDecoration: "underline" }}>
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

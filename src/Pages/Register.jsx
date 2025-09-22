import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { SuccessToast, ErrorToast } from "../Utils/ReactToast";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    <div className="bg-[url(/buddhaPot.png)] md:bg-[url(/buddha.png)] w-full h-screen bg-cover bg-left xl:bg-center flex justify-center items-center">
      <div className="rounded-2xl w-[90vw] lg:w-3/4 xl:w-2/3 h-[90%] overflow-scroll md:h-auto bg-[rgba(255,255,255,0.6)] p-8 shadow-2xl">
        <h2 className="text-3xl mb-8 text-black text-center font-bold">
          Register
        </h2>
        <form
          onSubmit={handleRegister}
          className="flex justify-around items-center gap-3"
        >
          {/* Left Section */}
          <div className="flex flex-col gap-4">
            <div className="md:flex flex-row gap-4 justify-center items-center">
              <div className="md:flex flex-col gap-4 justify-center items-center">
                <p className="text-xl text-black shadow-2xl font-semibold">
                  Personal Details
                </p>

                {/* Full Name */}
                <label className="input validator">
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
                    title="Must be 3–30 chars, letters/numbers/dash/space/dot"
                  />
                </label>
                <p className="validator-hint text-sm text-gray-600">
                  <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Must
                  be 3 to 30 characters (letters, numbers, dash, space and dot)
                </p>

                {/* Email */}
                <label className="input validator">
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
                  <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Enter
                  a valid email
                </p>

                {/* Phone */}
                <label className="input validator">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="tabular-nums"
                    required
                    placeholder="Phone"
                    pattern="[0-9]{10}"
                    minLength="10"
                    maxLength="10"
                    title="Must be 10 digits"
                  />
                </label>
                <p className="validator-hint text-sm text-gray-600">
                  <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Must
                  be 10 digits
                </p>
              </div>

              {/* Divider */}
              <div className="bg-gray-600 rounded-2xl hidden md:flex w-[4px] h-[400px]"></div>

              {/* Right Section */}
              <div className="flex flex-col gap-4 justify-center items-center">
                <p className="text-xl text-black shadow-2xl font-semibold">
                  Account Credentials
                </p>

                {/* Username */}
                <label className="input validator">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Username"
                    pattern="[A-Za-z][A-Za-z0-9\-]{2,29}" // ✅ matches backend
                    minLength="3"
                    maxLength="30"
                    title="Must be 3–30 chars, letters/numbers/dash"
                  />
                </label>
                <p className="validator-hint text-sm text-gray-600">
                  <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Must
                  be 3 to 30 characters (letters, numbers or dash)
                </p>

                {/* Password */}
                <label className="input validator">
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
                  <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Must be
                  at least 8 characters
                </p>

                {/* Confirm Password */}
                <label className="input validator">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm Password"
                    minLength="8"
                    title="Must match the password"
                  />
                </label>
                <p className="validator-hint text-sm text-gray-600">
                  <i className="fa-solid fa-circle-exclamation"></i>&nbsp;Password must match
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col justify-center items-center w-full">
              <button
                type="submit"
                className="mt-4 py-2 px-6 rounded-xl w-1/2 cursor-pointer bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Register
              </button>
              <br />
              <p className="text-black">
                Already have an account?{" "}
                <NavLink to="/login" style={{ textDecoration: "underline" }}>
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

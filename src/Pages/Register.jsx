import React from "react";
import {NavLink} from "react-router-dom"

const Register = () => {
  return (
    <div className="bg-[url(/buddhaPot.png)] md:bg-[url(/buddha.png)] w-full h-screen bg-cover bg-left xl:bg-center flex justify-center items-center">
      <div className="rounded-2xl w-[90vw] lg:w-3/4 xl:w-2/3 h-[90%] overflow-scroll md:h-auto bg-[rgba(255,255,255,0.6)] p-8 shadow-2xl">
        <h2 className="text-3xl mb-8 text-black text-center font-bold">
          Register
        </h2>
        <form className="flex flex-col md:flex-row justify-around items-center gap-3">
          {/* Left Section */}
          <div className=" md:flex flex-col gap-4 justify-center items-center">
            <p className="text-xl text-black shadow-2xl font-semibold">
              Personal Details
            </p>
            {/* First Name */}
            <label className="input validator">
              <input
                type="text"
                required
                placeholder="Full Name"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
              />
            </label>
            <p className="validator-hint text-sm text-gray-600">
              Must be 3 to 30 characters (letters, numbers or dash)
            </p>

            {/* Email */}
            <label className="input validator">
              <input type="email" placeholder="Email" required />
            </label>
            <p className="validator-hint text-sm text-gray-600">
              Enter a valid email
            </p>

            {/* Phone */}
            <label className="input validator">
              <input
                type="tel"
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
              Must be 10 digits
            </p>
          </div>
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
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
              />
            </label>
            <p className="validator-hint text-sm text-gray-600">
              Must be 3 to 30 characters (letters, numbers or dash)
            </p>

            {/* Password */}
            <label className="input validator">
              <input
                type="password"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must include number, lowercase and uppercase letter"
              />
            </label>
            <p className="validator-hint text-sm text-gray-600">
              8+ characters, with number, lowercase & uppercase
            </p>

            {/* Confirm Password */}
            <label className="input validator">
              <input
                type="password"
                required
                placeholder="Confirm Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must match the password requirements"
              />
            </label>
            <p className="validator-hint text-sm text-gray-600">
              Same requirements as password
            </p>
          </div>
        </form>

        {/* Submit Button */}
        <form>
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
        </form>
      </div>
    </div>
  );
};

export default Register;

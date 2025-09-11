import React from 'react'
import { NavLink } from 'react-router';

const LoginRegister = () => {
  return (
    <div className="bg-[url(/buddhaPot.png)] md:bg-[url(/buddha.png)] w-full h-screen bg-cover bg-left xl:bg-center flex justify-center items-center">
      <div className="rounded-2xl w-[90vw] lg:w-3/4 xl:w-2/3 h-auto bg-[rgba(255,255,255,0.6)] p-8 shadow-2xl">
        <h2 className="text-3xl mb-8 text-black text-center font-bold">
          Login
        </h2>
        <form className="flex flex-row justify-around items-center gap-3">
          <div className="flex flex-col gap-4 justify-center items-center">
            {/* Username */}
            <label className="input validator">
              <input
                type="text"
                required
                placeholder="Enter Username"
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
                placeholder="Enter Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must include number, lowercase and uppercase letter"
              />
            </label>
            <p className="validator-hint text-sm text-gray-600">
              8+ characters, with number, lowercase & uppercase
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
              Login
            </button>
            <br />
            <p className='text-black'>
              Don't have an account?{" "}
              <NavLink to="/register" style={{ textDecoration: "underline" }}>
                Register
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRegister
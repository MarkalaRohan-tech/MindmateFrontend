import React from 'react'
import { NavLink } from "react-router-dom";
import { useEffect } from 'react';
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";


const Navbar = ({ pos }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={pos}>
      <div className="navbar bg-base-100 h-2 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost xl:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu gap-2 menu-sm dropdown-content font-semibold bg-base-100 rounded-box z-1 mt-3 w-50 p-1 shadow"
            >
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/moodcheck">Mood Checkin</NavLink>
              </li>
              <li>
                <NavLink to="/selfcare">Self Care</NavLink>
              </li>
              <li>
                <NavLink to="/peermessage">Messages</NavLink>
              </li>
              <li className="hidden">
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <NavLink to="/login">
                <li className="btn h-8 bg-orange-400 text-white font-semibold">
                  Login
                </li>
              </NavLink>
              <div className="p-2">
                <label className="flex cursor-pointer gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-5 h-5 ${
                      theme === "light" ? "text-orange-400" : "text-orange-500"
                    }`}
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>

                  <input
                    type="checkbox"
                    className="toggle w-10 h-5 rounded-full p-1"
                    onChange={toggleTheme}
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-5 h-5 ${
                      theme === "light" ? "text-blue-800" : "text-yellow-200"
                    }`}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </label>
              </div>
            </ul>
          </div>
          <NavLink
            to="/"
            className="text-xl flex justify-center items-center cursor-pointer gap-2"
          >
            <img className="w-8" src="/LogoNew.png" alt="Logo" />
            <span className="font-bold bg-gradient-to-r from-orange-500 to-yellow-300 text-transparent bg-clip-text">
              MindMate
            </span>
          </NavLink>
        </div>
        <div className="navbar-end hidden xl:flex">
          <ul className="menu gap-2 menu-horizontal px-1  font-semibold">
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/moodcheck">Mood Checker</NavLink>
            </li>
            <li>
              <NavLink to="/selfcare">Self Care</NavLink>
            </li>
            <li>
              <NavLink to="/peermessage">Messages</NavLink>
            </li>
            <li className="hidden">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <NavLink to="/login">
              <li className="btn h-8 bg-orange-400 text-white font-semibold">
                Login
              </li>
            </NavLink>
            <div className="h-full w-fit p-1.5">
              <label className="flex cursor-pointer gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-5 h-5 ${
                    theme === "light" ? "text-orange-400" : "text-orange-500"
                  }`}
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>

                <input
                  type="checkbox"
                  className="toggle w-10 h-5 rounded-full p-1"
                  onChange={toggleTheme}
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-5 h-5 ${
                    theme === "light" ? "text-blue-800" : "text-yellow-200"
                  }`}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </label>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar
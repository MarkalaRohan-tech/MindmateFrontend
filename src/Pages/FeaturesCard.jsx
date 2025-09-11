import React from 'react'
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const FeaturesCard = ({ header, para, icon }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-600 shadow-gray-700" : "text-black"
      } card bg-base-100 w-90 rounded-2xl hover:shadow-2xl shadow-xl mx-auto`}
    >
      <figure className="px-10 pt-10">
        <i className={` ${icon} text-5xl text-orange-400 rounded-xl`}></i>
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{header}</h2>
        <p>{para}</p>
      </div>
    </div>
  );
}

export default FeaturesCard
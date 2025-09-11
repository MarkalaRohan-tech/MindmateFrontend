import React from 'react'
import { NavLink } from 'react-router-dom';
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import { recentActivities } from '../Data';
import { achievedbadges } from '../Data';
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="w-[100vw] h-[100vh] px-3 pt-[70px] overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold">
        Your Wellness Overview
      </h1>
      <div className="flex flex-col xl:flex-row justify-center gap-2 items-start w-full max-w-full mt-5 ">
        <div className="w-2/3">
          <div className="flex flex-col h-1/2 md:flex-row gap-2 mb-5">
            {/* Daily mood log rate */}
            <div className="w-[80vw] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
              <h1 className="text-xl font-bold">Daily Mood Log Rate</h1>
              <p className="my-5">How often you logged your mood this month.</p>
              <p className="text-7xl text-orange-400 mt-5 font-bold mb-5">
                85%
                <span className="text-sm font-medium text-gray-400">
                  (26 out of 30)
                </span>
              </p>
              <progress
                className="progress bg-orange-200 text-orange-400 w-56 mt-5 mb-5"
                value="85"
                max="100"
              ></progress>
              <p className="text-blue-400 m-1 font-semibold text-sm md:text-lg">
                You are more happy than previous month
              </p>
              <p className="text-success m-1 font-semibold text-sm md:text-lg">
                2% more compared to previous month
              </p>
            </div>

            {/* Weekly mood trend */}
            <div className="w-[80vw] md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg">
              <h1 className="text-xl font-bold">Weekly Mood Trend</h1>
              <p className="my-5">Your mood average over the past week.</p>
              <LineGraph />
              <div className="flex justify-end">
                <NavLink className="btn btn-light shadow-lg" to="/moodcheck">
                  View Full Chart
                </NavLink>
              </div>
            </div>
          </div>

          {/* Selfcare acivity log */}
          <div className="flex flex-col md:flex-row  gap-2 mb-5">
            <div className="w-[80vw] md:flex-1 flex flex-col p-5 border-2 border-white rounded-2xl shadow-lg">
              <h1 className="text-xl font-bold">Self-Care Activity Log</h1>
              <p className="my-5">Progress on your self-care goals.</p>
              <BarGraph />
              <div className="flex justify-end">
                <NavLink className="btn btn-light shadow-lg" to="/selfcare">
                  View Full Chart
                </NavLink>
              </div>
            </div>
            {/* Suggested activites */}
            <div className="w-[80vw] md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg">
              <h1 className="text-xl font-bold mb-5">Recent Activities</h1>
              <ul>
                {recentActivities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-center shadow-lg p-3 rounded-2xl gap-2 mb-4"
                  >
                    <span className="text-orange-500 text-lg">
                      <i
                        className={` ${activity.icon} text-2xl text-orange-400 rounded-xl`}
                      ></i>
                    </span>
                    <div>
                      <p
                        className={`${
                          theme === "dark" ? "text-white" : "text-black"
                        } text-sm`}
                      >
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className=" w-full xl:w-1/3 h-auto mb-5">
          <div className="w-[80vw] md:w-[95%] border-2 border-white h-auto p-3 m-1 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mt-1 mb-5">Your Achievements</h1>
            <hr className="mb-5 opacity-25" />
            <div className="overflow-scroll mt-5 mb-5 mr-5">
              <ul>
                {achievedbadges.map((badge, index) => (
                  <li key={index}>
                    <div className="badgeDetails border-2 border-white p-5 m-3 gap-3 shadow-lg rounded-xl w-[93%] md:w-[97%]  grid grid-cols-[30%_70%] md:grid-cols-[20%_80%] lg:grid-cols-[20%_80%] justify-center items-center">
                      <div className="Badge rounded-full w-[60px] h-[60px] md:w-[75px] md:h-[75px] overflow-hidden flex justify-center items-center">
                        <img
                          src={badge.logo}
                          alt="Logo"
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="title text-orange-400 font-semibold">
                          {badge.title}
                        </p>
                        <p className="description text-gray-500 text-sm">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex mb-3 justify-center">
              <NavLink className="btn btn-light shadow-lg" to="/profile">
                Explore More Badges
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
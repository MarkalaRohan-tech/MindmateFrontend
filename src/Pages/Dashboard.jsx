import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Quote } from "lucide-react";
import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";

const Dashboard = () => {
  const [quote, setQuote] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { theme } = useContext(ThemeContext);
  const {user} = useAuth();

  useEffect(() => {
    // Fetch Dashboard Data
    const fetchDashboard = async () => {
      try {
        const userId = user?._id;
        const res = await axios.get(`/api/dashboard/${userId}`);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    // Fetch Daily Quote
    const fetchQuote = async () => {
      try {
        const res = await axios.get(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            "https://zenquotes.io/api/today"
          )}`
        );
        const data = JSON.parse(res.data.contents);
        setQuote(data[0]);
      } catch (err) {
        console.error("Error fetching quote:", err);
      }
    };

    fetchDashboard();
    fetchQuote();
  }, []);

  if (!dashboardData) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();


  return (
    <div className="w-[100vw] h-[100vh] px-3 pt-[70px] overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold">
        Your Wellness Overview
      </h1>

      <div className="flex flex-col xl:flex-row justify-center gap-2 items-start w-full max-w-full mt-5">
        {/* LEFT SIDE */}
        <div className="w-2/3">
          <div className="flex flex-col h-1/2 md:flex-row gap-2 mb-5">
            {/* Mood Log */}
            <div className="w-[80vw] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg">
              <h1 className="text-xl font-bold">Daily Mood Log Rate</h1>
              <p className="my-5">How often you logged your mood this month.</p>
              <p className="text-7xl text-orange-400 mt-5 font-bold mb-5">
                {dashboardData.moodStreak}%
                <span className="text-sm font-medium text-gray-400">
                  ({dashboardData.moodLogsCount} of {daysInMonth} days this
                  month)
                </span>
              </p>

              <progress
                className="progress bg-orange-200 text-orange-400 w-56 mt-5 mb-5"
                value={dashboardData.moodStreak}
                max="100"
              ></progress>
              <div className="flex justify-end">
                <NavLink className="btn btn-light shadow-lg" to="/moodcheck">
                  View Details
                </NavLink>
              </div>
            </div>

            {/* Self-care streak */}
            <div className="w-[80vw] md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg">
              <h1 className="text-xl font-bold">Weekly Self-Care Streak</h1>
              <p className="my-5">
                Self-care activity average streak throughout the week.
              </p>
              <p className="text-7xl text-orange-400 mt-5 font-bold mb-5">
                {dashboardData.selfCareStreak}%
                <span className="text-sm font-medium text-gray-400">
                  ({dashboardData.selfCareLogsCount} activities)
                </span>
              </p>

              <progress
                className="progress bg-orange-200 text-orange-400 w-56 mt-5 mb-5"
                value={dashboardData.selfCareStreak}
                max="100"
              ></progress>
              <div className="flex justify-end">
                <NavLink className="btn btn-light shadow-lg" to="/selfcare">
                  View Details
                </NavLink>
              </div>
            </div>
          </div>

          {/* Daily Quote */}
          <div className="flex justify-center items-center h-full border-2 border-white p-5 rounded-2xl shadow-lg">
            <img src="/zen.png" alt="Meditating" className="w-[460px]" />
            <div className="flex justify-center items-center h-full p-6">
              <div className="bg-orange-500 text-white p-8 rounded-2xl shadow-2xl max-w-2xl text-center relative">
                <Quote
                  size={64}
                  className="absolute -top-6 -left-6 opacity-90 drop-shadow-lg text-orange-400"
                />
                <h1 className="text-3xl font-bold mb-4">Daily Quote</h1>
                {quote ? (
                  <>
                    <p className="text-xl italic leading-relaxed mb-6">
                      “{quote.q}”
                    </p>
                    <h2 className="text-lg font-semibold tracking-wide">
                      — {quote.a}
                    </h2>
                  </>
                ) : (
                  <p className="text-lg">Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Achievements */}
        <div className="w-full xl:w-1/3 h-auto mb-5">
          <div className="w-[80vw] md:w-[95%] border-2 border-white h-auto p-3 m-1 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mt-1 mb-5">Your Achievements</h1>
            <hr className="mb-5 opacity-25" />
            <div className="overflow-scroll mt-5 mb-5 mr-5">
              <ul>
                {dashboardData.badges.map((badge, index) => (
                  <li key={index} className="m-2">
                    <div className="badgeDetails border-2 border-white p-5 m-3 gap-3 shadow-lg rounded-xl w-[93%] md:w-[97%] grid grid-cols-[30%_70%] md:grid-cols-[20%_80%] lg:grid-cols-[20%_80%] justify-center items-center">
                      <div className="Badge rounded-full w-[60px] h-[60px] md:w-[75px] md:h-[75px] overflow-hidden flex justify-center items-center">
                        <img
                          src={badge.logo}
                          alt="Logo"
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="title text-orange-600 font-semibold">
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
};

export default Dashboard;

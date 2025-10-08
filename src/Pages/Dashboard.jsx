import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Quote } from "lucide-react";
import { ThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import api from "../Utils/axiosInstance";

const Dashboard = () => {
  const [quote, setQuote] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch Dashboard Data
    const fetchDashboard = async () => {
      try {
        const userId = user?._id;
        const res = await api.get(`/api/dashboard/${userId}`);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    // Fetch Daily Quote
    const fetchQuote = async () => {
      try {
        const res = await api.get(
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
  }, [user]);

  if (!dashboardData) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  return (
    <div className="w-full min-h-screen px-3 md:px-6 pt-[70px] pb-8 overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold mb-6">
        Your Wellness Overview
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6 max-w-[1600px] mx-auto">
        {/* LEFT & CENTER SECTIONS - Takes 2 columns on XL screens */}
        <div className="xl:col-span-2 space-y-4">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mood Log */}
            <div className="flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg bg-base-100">
              <h1 className="text-xl font-bold">Daily Mood Log Rate</h1>
              <p className="my-3 text-sm">
                How often you logged your mood this month.
              </p>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-5xl md:text-6xl text-orange-400 font-bold mb-2">
                  {dashboardData.moodStreak}%
                </p>
                <span className="text-xs md:text-sm font-medium text-gray-400">
                  ({dashboardData.moodLogsCount} of {daysInMonth} days this
                  month)
                </span>
              </div>

              <progress
                className="progress bg-orange-200 text-orange-400 w-full mt-4 mb-4"
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
            <div className="flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg bg-base-100">
              <h1 className="text-xl font-bold">Weekly Self-Care Streak</h1>
              <p className="my-3 text-sm">
                Self-care activity average streak throughout the week.
              </p>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-5xl md:text-6xl text-orange-400 font-bold mb-2">
                  {dashboardData.selfCareStreak}%
                </p>
                <span className="text-xs md:text-sm font-medium text-gray-400">
                  ({dashboardData.selfCareLogsCount} activities)
                </span>
              </div>

              <progress
                className="progress bg-orange-200 text-orange-400 w-full mt-4 mb-4"
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

          {/* Daily Quote Section */}
          <div className="border-2 border-white rounded-2xl shadow-lg bg-base-100 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center p-5 md:p-8">
              <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
                <img
                  src="/zen.png"
                  alt="Meditating"
                  className="w-full max-w-[300px] md:max-w-[400px] object-contain"
                />
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <div className="bg-orange-500 text-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center relative">
                  <Quote
                    size={48}
                    className="absolute -top-4 -left-4 opacity-90 drop-shadow-lg text-orange-400"
                  />
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">
                    Daily Quote
                  </h1>
                  {quote ? (
                    <>
                      <p className="text-lg md:text-xl italic leading-relaxed mb-4">
                        "{quote.q}"
                      </p>
                      <h2 className="text-base md:text-lg font-semibold tracking-wide">
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
        </div>

        {/* RIGHT SIDE - Achievements */}
        <div className="xl:col-span-1">
          <div className="border-2 border-white rounded-2xl shadow-lg bg-base-100 p-5 h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Your Achievements</h1>
            <hr className="mb-4 opacity-25" />

            <div className="flex-1 overflow-y-auto max-h-[600px] xl:max-h-none pr-2">
              {dashboardData.badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] py-8">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                      <svg
                        className="w-12 h-12 text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-400 animate-ping opacity-75"></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Start Your Journey!
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-xs mb-4">
                    Complete activities to unlock your first achievement badge
                  </p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span className="px-3 py-1 rounded-full bg-orange-50">
                      🎯 Log Moods
                    </span>
                    <span className="px-3 py-1 rounded-full bg-orange-50">
                      💪 Self-Care
                    </span>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {dashboardData.badges.map((badge, index) => (
                    <li key={index}>
                      <div className=" ml-3 border-2 border-white p-4 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
                        <div className="flex-shrink-0 rounded-full w-16 h-16 overflow-hidden flex justify-center items-center bg-orange-50">
                          <img
                            src={badge.logo}
                            alt={badge.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-orange-600 font-semibold text-base truncate">
                            {badge.title}
                          </p>
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {dashboardData.badges.length < 3 && (
                    <li className="mt-6">
                      <div className="border-2 border-dashed border-orange-200 p-6 rounded-xl bg-orange-50/30 flex flex-col items-center justify-center gap-2 min-h-[120px]">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center animate-bounce">
                          <svg
                            className="w-6 h-6 text-orange-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-orange-600">
                          More badges await!
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                          Keep up your wellness activities
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
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

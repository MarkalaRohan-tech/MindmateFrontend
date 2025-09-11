import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import { moodActivities } from '../Data';
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../App.css";
import MoodChart from './MoodChart';

const MoodcheckIn = () => {
  const { theme } = useContext(ThemeContext);
  const [mood, setMood] = useState(3);
  const [activity, setActivity] = useState(0);

  const btn = document.querySelector(".moodLock");
  const alert = document.querySelector(".moodAlert");
  const moodOpt = document.querySelector(".mood");
  const lockOption = () => {
    btn.classList.add("hidden");
    moodOpt.classList.add("hidden");
    alert.classList.remove("hidden");
  }
  
  const moodChange = (e) => {
    setMood(e.target.value);
  }

  const activityStatus = (e) => {
    if (e.target.checked) {
      setActivity((prev) => prev + 1);
    } else {
      setActivity((prev) => prev - 1);
    }
  };

  const moodMap = {
    1: "sad",
    2: "dissatisfied",
    3: "neutral",
    4: "calm",
    5: "happy",
  };

  const selectedMood = moodMap[mood];
  const activities = moodActivities[selectedMood];

  const now = new Date();
  const hours = now.getHours();

  const getMoodTime = () => {
    if (hours >= 5 && hours <= 11) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    return "evening";
  };

  const currentMoodTime = getMoodTime();

  
  return (
    <div className="w-[100vw] h-[100vh] px-5 pt-[70px] overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold">Your Mood Journey</h1>
      <p className="mt-3 mb-3">
        Explore your mood history and gain insights into your emotional pattern
        over time. <br />
        Take Control of your well-being.
      </p>
      {currentMoodTime === "morning" && (
        <div className="morningMood flex flex-col lg:flex-row justify-center gap-2 items-start w-full max-w-full mt-5 ">
          <div className="w-1/3">
            <div className="flex flex-col h-1/2 gap-2 mb-5">
              {/* Daily mood log*/}
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold">Morning Mood Log</h1>
                <p>Record Your mood</p>
                <div
                  role="alert"
                  className="moodAlert hidden mt-5 mb-5 alert alert-info"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Morning mood logged!</span>
                </div>
                <div className="mood flex flex-row gap-5 mt-5 mb-5 justify-center">
                  {/* 1 */}
                  <label htmlFor="sad" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="sad"
                      value={1}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-red-400 transition-colors"
                    >
                      sentiment_sad
                    </span>
                  </label>

                  {/* 2 */}
                  <label htmlFor="upset" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="upset"
                      value={2}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-orange-400 transition-colors"
                    >
                      sentiment_dissatisfied
                    </span>
                  </label>

                  {/* 3 */}
                  <label htmlFor="neutral" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="neutral"
                      value={3}
                      className="hidden peer"
                      onChange={moodChange}
                      defaultChecked
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-yellow-400 transition-colors"
                    >
                      sentiment_neutral
                    </span>
                  </label>

                  {/* 4 */}
                  <label htmlFor="calm" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="calm"
                      value={4}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-green-400 transition-colors"
                    >
                      sentiment_calm
                    </span>
                  </label>

                  {/* 5 */}
                  <label htmlFor="happy" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="happy"
                      value={5}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-green-600 transition-colors"
                    >
                      sentiment_satisfied
                    </span>
                  </label>
                </div>
                <NavLink
                  className="moodLock btn bg-orange-400 "
                  onClick={lockOption}
                >
                  <b className='text-white'>Submit</b>
                </NavLink>
              </div>
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold">Suggested Activies</h1>
                <p className="my-2">Activities suggested based on your mood.</p>
                <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
                  {activity * 25}% &nbsp;
                  <span className="text-sm font-medium text-gray-400">
                    ({activity} out of 4)
                  </span>
                </p>
                <div className="w-56 h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-2">
                  <div
                    className="h-full bg-orange-400 transition-all duration-500 ease-in-out"
                    style={{ width: `${activity * 25}%` }}
                  ></div>
                </div>

                <p className="text-orange-400 m-1 mb-5 p-3 font-semibold text-sm md:text-lg">
                  List of Activities
                </p>
                <div className="h-50 overflow-y-scroll">
                  <ul>
                    {activities.map((activity, index) => {
                      return (
                        <li key={index}>
                          <div className="p-3 my-2 grid grid-cols-[20%_80%] rounded-2xl shadow-lg border-2 border-white">
                            <div className="flex justify-center items-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 accent-orange-400 cursor-pointer"
                                onChange={activityStatus}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-orange-400 font-semibold">
                                {activity.title}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3">
            {/* Weekly mood trend */}
            <div className="w-[100%] h-lvh md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg justify-center items-center">
              <h1 className="text-xl font-bold">Weekly Morning Mood Trend</h1>
              <p className="my-5">
                Your morning mood average over the past week.
              </p>
              <MoodChart />
            </div>
          </div>
        </div>
      )}
      {currentMoodTime === "afternoon" && (
        <div className="afternoonMood flex flex-col lg:flex-row justify-center gap-2 items-start w-full max-w-full mt-5 ">
          <div className="w-1/3">
            <div className="flex flex-col h-1/2 gap-2 mb-5">
              {/* Daily mood log*/}
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold">Afternoon Mood Log</h1>
                <p>Record Your mood</p>
                <div
                  role="alert"
                  className="moodAlert hidden mt-5 mb-5 alert alert-info"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Afternoon mood logged!</span>
                </div>
                <div className="mood flex flex-row gap-5 mt-5 mb-5 justify-center">
                  {/* 1 */}
                  <label htmlFor="sad" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="sad"
                      value={1}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-red-400 transition-colors"
                    >
                      sentiment_sad
                    </span>
                  </label>

                  {/* 2 */}
                  <label htmlFor="upset" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="upset"
                      value={2}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-orange-400 transition-colors"
                    >
                      sentiment_dissatisfied
                    </span>
                  </label>

                  {/* 3 */}
                  <label htmlFor="neutral" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="neutral"
                      value={3}
                      className="hidden peer"
                      onChange={moodChange}
                      defaultChecked
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-yellow-400 transition-colors"
                    >
                      sentiment_neutral
                    </span>
                  </label>

                  {/* 4 */}
                  <label htmlFor="calm" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="calm"
                      value={4}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-green-400 transition-colors"
                    >
                      sentiment_calm
                    </span>
                  </label>

                  {/* 5 */}
                  <label htmlFor="happy" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="happy"
                      value={5}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-green-600 transition-colors"
                    >
                      sentiment_satisfied
                    </span>
                  </label>
                </div>
                <NavLink
                  className="moodLock btn bg-orange-400 "
                  onClick={lockOption}
                >
                  <b className='text-white'>Submit</b>
                </NavLink>
              </div>
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold">Suggested Activies</h1>
                <p className="my-2">Activities suggested based on your mood.</p>
                <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
                  {activity * 25}% &nbsp;
                  <span className="text-sm font-medium text-gray-400">
                    ({activity} out of 4)
                  </span>
                </p>
                <div className="w-56 h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-2">
                  <div
                    className="h-full bg-orange-400 transition-all duration-500 ease-in-out"
                    style={{ width: `${activity * 25}%` }}
                  ></div>
                </div>

                <p className="text-orange-400 m-1 mb-5 p-3 font-semibold text-sm md:text-lg">
                  List of Activities
                </p>
                <div className="h-50 overflow-y-scroll">
                  <ul>
                    {activities.map((activity, index) => {
                      return (
                        <li key={index}>
                          <div className="p-3 my-2 grid grid-cols-[20%_80%] rounded-2xl shadow-lg border-2 border-white">
                            <div className="flex justify-center items-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 accent-orange-400 cursor-pointer"
                                onChange={activityStatus}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-orange-400 font-semibold">
                                {activity.title}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3">
            {/* Weekly mood trend */}
            <div className="w-[100%] h-lvh md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg justify-center items-center">
              <h1 className="text-xl font-bold">Weekly Afternoon Mood Trend</h1>
              <p className="my-5">
                Your Afternoon mood average over the past week.
              </p>
              <MoodChart />
            </div>
          </div>
        </div>
      )}
      {currentMoodTime === "evening" && (
        <div className="eveningMood flex flex-col lg:flex-row justify-center gap-2 items-start w-full max-w-full mt-5 ">
          <div className="w-1/3">
            <div className="flex flex-col h-1/2 gap-2 mb-5">
              {/* Daily mood log*/}
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold">Evening Mood Log</h1>
                <p>Record Your mood</p>
                <div
                  role="alert"
                  className="moodAlert hidden mt-5 mb-5 alert alert-info"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Evening mood logged!</span>
                </div>
                <div className="mood flex flex-row gap-5 mt-5 mb-5 justify-center">
                  {/* 1 */}
                  <label htmlFor="sad" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="sad"
                      value={1}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-red-400 transition-colors"
                    >
                      sentiment_sad
                    </span>
                  </label>

                  {/* 2 */}
                  <label htmlFor="upset" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="upset"
                      value={2}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-orange-400 transition-colors"
                    >
                      sentiment_dissatisfied
                    </span>
                  </label>

                  {/* 3 */}
                  <label htmlFor="neutral" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="neutral"
                      value={3}
                      className="hidden peer"
                      onChange={moodChange}
                      defaultChecked
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-yellow-400 transition-colors"
                    >
                      sentiment_neutral
                    </span>
                  </label>

                  {/* 4 */}
                  <label htmlFor="calm" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="calm"
                      value={4}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-green-400 transition-colors"
                    >
                      sentiment_calm
                    </span>
                  </label>

                  {/* 5 */}
                  <label htmlFor="happy" className="cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      id="happy"
                      value={5}
                      className="hidden peer"
                      onChange={moodChange}
                    />
                    <span
                      style={{ fontSize: "48px" }}
                      className="material-symbols-outlined text-5xl text-gray-700 peer-checked:text-green-600 transition-colors"
                    >
                      sentiment_satisfied
                    </span>
                  </label>
                </div>
                <NavLink
                  className="moodLock btn bg-orange-400 "
                  onClick={lockOption}
                >
                  <b className='text-white'>Submit</b>
                </NavLink>
              </div>
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold">Suggested Activies</h1>
                <p className="my-2">Activities suggested based on your mood.</p>
                <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
                  {activity * 25}% &nbsp;
                  <span className="text-sm font-medium text-gray-400">
                    ({activity} out of 4)
                  </span>
                </p>
                <div className="w-56 h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-2">
                  <div
                    className="h-full bg-orange-400 transition-all duration-500 ease-in-out"
                    style={{ width: `${activity * 25}%` }}
                  ></div>
                </div>

                <p className="text-orange-400 m-1 mb-5 p-3 font-semibold text-sm md:text-lg">
                  List of Activities
                </p>
                <div className="h-50 overflow-y-scroll">
                  <ul>
                    {activities.map((activity, index) => {
                      return (
                        <li key={index}>
                          <div className="p-3 my-2 grid grid-cols-[20%_80%] rounded-2xl shadow-lg border-2 border-white">
                            <div className="flex justify-center items-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 accent-orange-400 cursor-pointer"
                                onChange={activityStatus}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-orange-400 font-semibold">
                                {activity.title}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3">
            {/* Weekly mood trend */}
            <div className="w-[100%] h-lvh md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg justify-center items-center">
              <h1 className="text-xl font-bold">Weekly Evening Mood Trend</h1>
              <p className="my-5">
                Your evening mood average over the past week.
              </p>
              <MoodChart />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodcheckIn
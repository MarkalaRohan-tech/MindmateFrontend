import React, { useState,useEffect } from "react";
import "../App.css";
import MusicPlayer from "./MusicPlayer";
import SelfCareChart from "./SelfCareChart";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import JournalPage from "./JournalPage";

const SelfCareList = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selfCareActivities, setSelfCareActivities] = useState([]);

  // 🔹 Fetch activities for this user
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?._id) return;
      const res = await axios.get("/api/selfcare", {
        params: { userId: user._id },
        withCredentials: true,
      });
      setSelfCareActivities(res.data.activities || []);
    };
    fetchActivities();
  }, [user]);

  // 🔹 Add new activity
  const addActivity = async (e) => {
    e.preventDefault(); // prevent form reload
    if (!user?._id) return;
    const res = await axios.post(
      "/api/selfcare",
      { title, description, userId: user._id }, // ✅ include userId
      { withCredentials: true }
    );
    setSelfCareActivities(res.data);
    setTitle("");
    setDescription("");
  };

  // 🔹 Delete activity
 const deleteActivity = async (id) => {
   try {
     const res = await axios.delete(`/api/selfcare/${id}`, {
       withCredentials: true,
     });
     setSelfCareActivities(res.data);
   } catch (err) {
     console.error("Error deleting activity", err);
   }
 };


  // 🔹 Update activity status
  const activityStatus = async (e, id) => {
    if (e.target.checked) {
      await axios.patch(
        `/api/selfcare/${id}/increment`,
        { userId: user._id }, // ✅ include userId
        { withCredentials: true }
      );
      setSelfCareActivities((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, weeklyCount: (a.weeklyCount || 0) + 1 } : a
        )
      );
      setActivity((prev) => prev + 1);
    } else {
      setActivity((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div>
      <div className="w-[100vw] h-[100vh] px-5 pt-[70px] overflow-x-hidden">
        <h1 className="text-2xl md:text-4xl font-semibold">
          Self-Care Tracking
        </h1>
        <p className="mt-3 mb-3">
          Monitor your self-care activities.Set goals, and track your progress.
          <br />
          Take Control of your well-being.
        </p>
        <div className="morningMood flex flex-col justify-center gap-2 items-start w-full max-w-full mt-5 ">
          <div className="w-full grid grid-cols-2 gap-2">
            <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-3 rounded-2xl shadow-lg ">
              <h1 className="text-xl font-bold">Self-Care Activies</h1>
              <p className="font-semibold text-2xl my-5">Add New Activity:</p>
              <form action="#">
                <label htmlFor="title">
                  <b>Title</b>
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Enter Tiltle"
                  id="title"
                  className="input w-[90%]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <br />
                <br />
                <label htmlFor="title">
                  <b>Description</b>
                </label>
                <br />
                <textarea
                  className="textarea  w-[90%]"
                  placeholder="Enter description for activity"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <br />
                <br />
                <div className="flex justify-center items-center w-[90%]">
                  <button
                    onClick={addActivity}
                    className="btn bg-orange-400 text-white"
                  >
                    <b>Add</b>
                  </button>
                </div>
              </form>
              <p className="font-semibold text-2xl mt-5">Progress</p>
              <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
                {selfCareActivities.length > 0
                  ? `${Math.round(
                      (activity / selfCareActivities.length) * 100
                    )}%`
                  : "0%"}
                &nbsp;
                <span className="text-sm font-medium text-gray-400">
                  ({activity} out of {selfCareActivities.length})
                </span>
              </p>

              <div className="w-56 h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-2">
                <div
                  className="h-full bg-orange-400 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${(activity / selfCareActivities.length) * 100}%`,
                  }}
                ></div>
              </div>

              <p className="text-orange-400 m-1 p-3 font-semibold text-sm md:text-lg">
                List of Activities
              </p>
              <div className="h-50 overflow-y-scroll">
                {selfCareActivities.length === 0 ? (
                  <p className="text-orange-400 m-1 p-3 font-semibold text-sm md:text-lg h-full text-center flex justify-center items-center ">
                    No activities have been added
                  </p>
                ) : (
                  <ul className="p-3">
                    {selfCareActivities.map((activity, index) => {
                      return (
                        <li key={activity._id}>
                          <div className="p-3 my-2 grid grid-cols-[10%_80%_10%] rounded-2xl shadow-lg border-2 border-white">
                            <div className="flex justify-center items-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 accent-orange-400 cursor-pointer"
                                onChange={(e) =>
                                  activityStatus(e, activity._id)
                                }
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
                            <div className="flex flex-col justify-center items-center">
                              <button
                                className="btn bg-orange-400 rounded-lg text-white"
                                onClick={() => deleteActivity(activity._id)}
                              >
                                <b>
                                  <i class="fa-solid fa-trash"></i>
                                </b>
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex flex-col h-1/2 gap-2 mb-5">
              {/* Daily mood log*/}
              <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
                <h1 className="text-xl font-bold mb-5">
                  Music List for Meditation
                </h1>
                <MusicPlayer></MusicPlayer>
              </div>
            </div>
          </div>
          <div className="w-full">
            {/* Weekly mood trend */}
            <div className="w-[100%] h-lvh md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg justify-center items-center">
              <h1 className="text-xl font-bold">Weekly SelfCare Trend</h1>
              <p className="my-5">
                Your morning mood average over the past week.
              </p>
              <SelfCareChart list={selfCareActivities} />
            </div>

            <JournalPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelfCareList
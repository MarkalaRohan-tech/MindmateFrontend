import React, { useState, useEffect } from "react";
import "../App.css";
import MusicPlayer from "../components/MusicPlayer";
import SelfCareChart from "../components/SelfCareChart";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "../Utils/ReactToast";
import "react-toastify/dist/ReactToastify.css";

// --- Helpers ---
const isSameUTCDate = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
};

// Weekly count for last 7 days including today
const computeWeeklyCount = (performedDates = []) => {
  const today = new Date();
  const start = new Date(today);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6); // last 7 days
  return performedDates.filter((d) => new Date(d) >= start).length;
};

// Transform raw backend activity data
const transformActivity = (activity) => {
  const performedDates = activity.performedDates || [];
  return {
    ...activity,
    weeklyCount: computeWeeklyCount(performedDates),
    completedToday: performedDates.some((d) => isSameUTCDate(d, new Date())),
  };
};

// --- Component ---
const SelfCareList = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selfCareActivities, setSelfCareActivities] = useState([]);
  const [checkedActivities, setCheckedActivities] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const completedCount = checkedActivities.size;

  // --- Fetch Activities ---
  useEffect(() => {
    if (!user?._id) return;

    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/selfcare", {
          params: { userId: user._id },
          withCredentials: true,
        });

        const activities = (res.data.activities || []).map(transformActivity);
        setSelfCareActivities(activities);
        setCheckedActivities(
          new Set(activities.filter((a) => a.completedToday).map((a) => a._id))
        );
      } catch (err) {
        console.error("Error fetching activities:", err);
        toast(<ErrorToast message="Failed to fetch activities" />);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  // --- Auto-reset checkboxes at new day ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSelfCareActivities((prev) =>
        prev.map((a) => ({
          ...a,
          completedToday: a.performedDates?.some((d) =>
            isSameUTCDate(d, new Date())
          ),
        }))
      );
      setCheckedActivities(
        new Set(
          selfCareActivities
            .filter((a) =>
              a.performedDates?.some((d) => isSameUTCDate(d, new Date()))
            )
            .map((a) => a._id)
        )
      );
    }, 60 * 1000); // every 1 min
    return () => clearInterval(timer);
  }, [selfCareActivities]);

  // --- Toggle completion ---
  const activityStatus = async (e, id) => {
    const isChecked = e.target.checked;
    if (!user?._id) {
      toast(<ErrorToast message="User not authenticated" />);
      e.target.checked = false;
      return;
    }

    setLoading(true);
    try {
      const endpoint = isChecked
        ? `/api/selfcare/${id}/increment`
        : `/api/selfcare/${id}/decrement`;

      const res = await axios.patch(
        endpoint,
        { userId: user._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updated = transformActivity(res.data.activity);

        setSelfCareActivities((prev) =>
          prev.map((a) => (a._id === id ? updated : a))
        );

        setCheckedActivities((prev) => {
          const newSet = new Set(prev);
          if (isChecked) newSet.add(id);
          else newSet.delete(id);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error updating activity:", err);
      toast(<ErrorToast message="Failed to update activity" />);
    } finally {
      setLoading(false);
    }
  };

  // --- Add Activity ---
  const addActivity = async (e) => {
    e.preventDefault();
    if (!user?._id)
      return toast(<ErrorToast message="User not authenticated" />);
    if (!title.trim() || !description.trim())
      return toast(<ErrorToast message="Title and description are required" />);

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/selfcare",
        {
          title: title.trim(),
          description: description.trim(),
          userId: user._id,
        },
        { withCredentials: true }
      );

      // ✅ Correctly handle backend response
      const activitiesArray = Array.isArray(res.data.activities)
        ? res.data.activities
        : res.data.activity
        ? [res.data.activity] // wrap single object in array
        : [];

      const activities = activitiesArray.map(transformActivity);

      setSelfCareActivities(activities);
      setCheckedActivities(
        new Set(activities.filter((a) => a.completedToday).map((a) => a._id))
      );

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding activity:", err);
      toast(<ErrorToast message="Failed to add activity" />);
    } finally {
      setLoading(false);
    }
  };


  // --- Delete Activity ---
  const deleteActivity = async (id) => {
    if (!user?._id) {
      toast(<ErrorToast message="User not authenticated" />);
      return;
    }
    if (!confirm("Are you sure you want to delete this activity?")) return;

    setLoading(true);
    try {
      const res = await axios.delete(`/api/selfcare/${id}`, {
        params: { userId: user._id },
        withCredentials: true,
      });

      // ✅ Correctly handle backend response
      const activitiesArray = Array.isArray(res.data.activities)
        ? res.data.activities
        : res.data.activity
        ? [res.data.activity]
        : [];

      const activities = activitiesArray.map(transformActivity);
      setSelfCareActivities(activities);

      setCheckedActivities((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error("Error deleting activity:", err);
      toast(<ErrorToast message="Failed to delete activity" />);
    } finally {
      setLoading(false);
    }
  };


  // --- Render ---
  return (
    <div className="w-[100vw] h-[100vh] px-5 pt-[70px] overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold">Self-Care Tracking</h1>
      <p className="mt-3 mb-3">
        Monitor your self-care activities. Set goals, and track your progress.
        <br />
        Take control of your well-being.
      </p>

      <div className="morningMood flex flex-col justify-center gap-2 items-start w-full max-w-full mt-5">
        <div className="w-full grid grid-cols-2 gap-2">
          {/* Left Column */}
          <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-3 rounded-2xl shadow-lg">
            <h1 className="text-xl font-bold">Self-Care Activities</h1>
            <p className="font-semibold text-2xl my-5">Add New Activity:</p>
            <form onSubmit={addActivity}>
              <label>
                <b>Title</b>
              </label>
              <input
                type="text"
                placeholder="Enter Title"
                className="input w-[90%]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
              <label className="mt-2">
                <b>Description</b>
              </label>
              <textarea
                placeholder="Enter description for activity"
                className="textarea w-[90%]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
              />
              <div className="flex justify-center items-center w-[90%] mt-2">
                <button
                  type="submit"
                  className="btn bg-orange-400 text-white"
                  disabled={loading}
                >
                  <b>{loading ? "Adding..." : "Add"}</b>
                </button>
              </div>
            </form>

            <p className="font-semibold text-2xl mt-5">Progress</p>
            <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
              {selfCareActivities.length > 0
                ? `${Math.round(
                    (completedCount / selfCareActivities.length) * 100
                  )}%`
                : "0%"}
              <span className="text-sm font-medium text-gray-400">
                ({completedCount} out of {selfCareActivities.length})
              </span>
            </p>
            <div className="w-56 h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-2">
              <div
                className="h-full bg-orange-400 transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    selfCareActivities.length
                      ? (completedCount / selfCareActivities.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="h-50 overflow-y-scroll">
              {loading ? (
                <p className="text-center text-orange-400 p-4">
                  Loading activities...
                </p>
              ) : selfCareActivities.length === 0 ? (
                <p className="text-center text-orange-400 p-4">
                  No activities have been added
                </p>
              ) : (
                <ul className="p-3">
                  {selfCareActivities.map((activity) => (
                    <li key={activity._id}>
                      <div className="p-3 my-2 grid grid-cols-[10%_80%_10%] rounded-2xl shadow-lg border-2 border-white">
                        <div className="flex justify-center items-center">
                          <input
                            type="checkbox"
                            className="w-6 h-6 accent-orange-400 cursor-pointer"
                            checked={checkedActivities.has(activity._id)}
                            onChange={(e) => activityStatus(e, activity._id)}
                            disabled={loading}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-orange-400 font-semibold">
                            {activity.title}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            Weekly count: {activity.weeklyCount || 0}
                            {activity.lastPerformed && (
                              <span className="ml-2">
                                | Last:{" "}
                                {new Date(
                                  activity.lastPerformed
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                          <button
                            className="btn bg-orange-400 rounded-lg text-white"
                            onClick={() => deleteActivity(activity._id)}
                            disabled={loading}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="w-full">
            <div className="w-[100%] h-lvh md:flex-1 flex flex-col border-2 border-white p-5 rounded-2xl shadow-lg justify-center items-center">
              <h1 className="text-xl font-bold">Weekly SelfCare Trend</h1>
              <p className="my-5">Your Self-Care trend over the past week.</p>
              <SelfCareChart list={selfCareActivities} />
            </div>
          </div>
        </div>

        {/* Music Player */}
        <div>
          <div className="min-w-screen flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg">
            <h1 className="text-xl font-bold mb-5">
              Music List for Relaxation
            </h1>
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfCareList;

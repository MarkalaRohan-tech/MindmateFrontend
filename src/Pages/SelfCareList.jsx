// File: SelfCareList.jsx
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

const computeWeeklyCount = (performedDates = []) => {
  const today = new Date();
  const start = new Date(today);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6);
  return performedDates.filter((d) => new Date(d) >= start).length;
};

const transformActivity = (activity) => {
  const performedDates = activity.performedDates || [];
  return {
    ...activity,
    weeklyCount: computeWeeklyCount(performedDates),
    completedToday: performedDates.some((d) => isSameUTCDate(d, new Date())),
  };
};

const SelfCareList = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selfCareActivities, setSelfCareActivities] = useState([]);
  const [checkedActivities, setCheckedActivities] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const completedCount = checkedActivities.size;

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
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [selfCareActivities]);

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

      const activitiesArray = Array.isArray(res.data.activities)
        ? res.data.activities
        : res.data.activity
        ? [res.data.activity]
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

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 pt-[70px] pb-6 sm:pb-8 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
        Self-Care Tracking
      </h1>
      <p className="mt-2 sm:mt-3 mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
        Monitor your self-care activities. Set goals, and track your progress.
        <br className="hidden sm:block" />
        Take control of your well-being.
      </p>

      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full max-w-[1600px] mx-auto mt-4 sm:mt-5">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          <div className="w-full flex border-2 border-white flex-col p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg">
            <h1 className="text-lg sm:text-xl font-bold">
              Self-Care Activities
            </h1>

            <p className="font-semibold text-lg sm:text-xl md:text-2xl my-3 sm:my-4">
              Add New Activity:
            </p>
            <form onSubmit={addActivity} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-semibold mb-1 sm:mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  className="input w-full text-sm sm:text-base"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter description for activity"
                  className="textarea w-full text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex justify-center items-center w-full">
                <button
                  type="submit"
                  className="btn bg-orange-400 hover:bg-orange-500 text-white w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base"
                  disabled={loading}
                >
                  <b>{loading ? "Adding..." : "Add"}</b>
                </button>
              </div>
            </form>

            <p className="font-semibold text-lg sm:text-xl md:text-2xl mt-4 sm:mt-5">
              Progress
            </p>
            <p className="text-xl sm:text-2xl text-orange-400 mt-1 sm:mt-2 font-bold mb-1 sm:mb-2">
              {selfCareActivities.length > 0
                ? `${Math.round(
                    (completedCount / selfCareActivities.length) * 100
                  )}%`
                : "0%"}
              <span className="text-xs sm:text-sm font-medium text-gray-400 ml-2">
                ({completedCount} out of {selfCareActivities.length})
              </span>
            </p>
            <div className="w-full sm:w-64 h-3 sm:h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-3 sm:mb-4">
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

            <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {loading ? (
                <p className="text-center text-orange-400 p-3 sm:p-4 text-sm sm:text-base">
                  Loading activities...
                </p>
              ) : selfCareActivities.length === 0 ? (
                <p className="text-center text-orange-400 p-3 sm:p-4 text-sm sm:text-base">
                  No activities have been added
                </p>
              ) : (
                <ul className="space-y-2 sm:space-y-2.5">
                  {selfCareActivities.map((activity) => (
                    <li key={activity._id}>
                      <div className="p-2.5 sm:p-3 flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-2xl shadow-lg border-2 border-white">
                        <div className="flex justify-center items-center pt-0.5 sm:pt-1">
                          <input
                            type="checkbox"
                            className="w-5 h-5 sm:w-6 sm:h-6 accent-orange-400 cursor-pointer"
                            checked={checkedActivities.has(activity._id)}
                            onChange={(e) => activityStatus(e, activity._id)}
                            disabled={loading}
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
                          <p className="text-orange-400 font-semibold text-sm sm:text-base">
                            {activity.title}
                          </p>
                          <p className="text-gray-500 text-xs sm:text-sm">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            Weekly count: {activity.weeklyCount || 0}
                            {activity.lastPerformed && (
                              <span className="ml-1 sm:ml-2">
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
                            className="btn btn-sm sm:btn-md bg-orange-400 hover:bg-orange-500 rounded-lg text-white"
                            onClick={() => deleteActivity(activity._id)}
                            disabled={loading}
                          >
                            <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className="w-full h-auto min-h-[300px] sm:min-h-[400px] lg:h-full flex flex-col border-2 border-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg justify-center items-center">
              <h1 className="text-lg sm:text-xl font-bold text-center">
                Weekly SelfCare Trend
              </h1>
              <p className="my-3 sm:my-4 text-sm sm:text-base text-center text-gray-600">
                Your Self-Care trend over the past week.
              </p>
              <div className="w-full flex-1">
                <SelfCareChart list={selfCareActivities} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex border-2 border-white flex-col p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg">
            <h1 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5">
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

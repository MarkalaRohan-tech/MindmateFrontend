import React, { useState, useEffect } from "react";
import { moodActivities } from "../Data";
import "../App.css";
import axios from "axios";
import { SuccessToast, ErrorToast } from "../Utils/ReactToast";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import MoodLogForm from "../components/MoodLogForm";
import MoodTrendChart from "../Components/MoodTrendChart";
import SuggestedActivity from "../components/SuggestedActivity";

const MoodcheckIn = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState(3);
  const [lastLoggedMood, setLastLoggedMood] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [aiActivities, setAiActivities] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fetchError, setFetchError] = useState(null);

  const hours = new Date().getHours();
  const currentMoodTime =
    hours >= 5 && hours <= 11
      ? "morning"
      : hours >= 12 && hours < 18
      ? "afternoon"
      : "evening";

  const moodMap = {
    1: "sad",
    2: "dissatisfied",
    3: "neutral",
    4: "calm",
    5: "happy",
  };

  const selectedMoodLabel = moodMap[mood];
  const fallbackActivities = moodActivities[selectedMoodLabel] || [];

  const moodChange = (e) => {
    const newMood = Number(e.target.value);
    setMood(newMood);
  };

  useEffect(() => {
    if (!user?._id) return;

    const fetchInitialData = async () => {
      try {
        const moodRes = await axios.get("/api/activity/getLatestMood", {
          params: { userId: user._id, timeOfDay: currentMoodTime },
        });

        const latestMoodValue = moodRes.data.mood;

        if (latestMoodValue !== null) {
          setLastLoggedMood(latestMoodValue);
          setMood(latestMoodValue);
        } else {
          const allTimeActivities = await axios
            .get("/api/activity/getAllUserActivities", {
              params: { userId: user._id, time: currentMoodTime },
            })
            .catch(() => null);

          if (allTimeActivities?.data?.activities?.length > 0) {
            const mostRecentActivity = allTimeActivities.data.activities[0];
            const inferredMood = mostRecentActivity.mood;
            setLastLoggedMood(inferredMood);
            setMood(inferredMood);
          } else {
            setLastLoggedMood(null);
            setMood(3);
          }
        }
      } catch (err) {
        setLastLoggedMood(null);
        setMood(3);
      }
    };

    fetchInitialData();
  }, [user?._id, currentMoodTime]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const moodToFetch = lastLoggedMood !== null ? lastLoggedMood : mood;

    const fetchActivities = async () => {
      try {
        setFetchError(null);

        const res = await axios.get("/api/activity/getActivities", {
          params: {
            userId: user._id,
            mood: moodToFetch,
            time: currentMoodTime,
          },
        });

        if (res.data.activities?.length > 0) {
          setAiActivities(res.data.activities);
        } else {
          setAiActivities([]);
        }
      } catch (err) {
        let errorMessage = "Failed to fetch activities";
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.status) {
          errorMessage = `Server error (${err.response.status})`;
        }

        setFetchError(errorMessage);
        setAiActivities([]);

        if (err.response?.status !== 404) {
          toast(<ErrorToast message={errorMessage} />);
        }
      }
    };

    fetchActivities();
  }, [user?._id, lastLoggedMood, mood, currentMoodTime]);

  useEffect(() => {
    // Remove debug logging
  }, [aiActivities]);

  const lockOption = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/mood/update", {
        moodValue: mood,
        timeOfDay: currentMoodTime,
        userId: user._id,
      });

      if (res.status === 200) {
        setLastLoggedMood(mood);
        toast(<SuccessToast message="Mood updated successfully" />);
        setAlertVisible(true);

        await fetchAISuggession();

        setRefreshKey((prev) => prev + 1);
      } else {
        toast(<ErrorToast message="Mood update failed" />);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Mood update failed";
      toast(<ErrorToast message={errorMsg} />);
    }
  };

  const fetchAISuggession = async () => {
    let activities = [];
    setLoadingAI(true);

    try {
      const aiRes = await axios.post("/api/ai/getSuggestion", {
        prompt: `Suggest 4 unique and brainstorming short activities for mood: ${mood}, time of day: ${currentMoodTime}. Respond ONLY as a JSON array of objects like this: [{ "title": "Activity Title", "description": "Short description" }]`,
      });

      activities = aiRes.data.activities;

      if (!Array.isArray(activities) || activities.length === 0) {
        toast(<ErrorToast message="No activities suggested." />);
        setLoadingAI(false);
        return;
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "AI suggestion fetch failed";
      toast(<ErrorToast message={errorMsg} />);
      setLoadingAI(false);
      return;
    }

    try {
      const dbRes = await axios.post("/api/activity/addActivities", {
        activities,
        mood,
        time: currentMoodTime,
        userId: user._id,
      });

      setAiActivities(dbRes.data.activities);
      toast(<SuccessToast message="Activities saved successfully" />);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Saving activities to DB failed";
      toast(<ErrorToast message={errorMsg} />);
    }

    setLoadingAI(false);
  };

  const activityStatus = async (activityId, checked, index) => {
    if (activityId) {
      try {
        await axios.post("/api/activity/toggle", {
          activityId,
          completed: checked,
          userId: user._id,
        });

        setAiActivities((prev) =>
          prev.map((a) =>
            a._id === activityId ? { ...a, completed: checked } : a
          )
        );
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || "Failed to update activity";
        toast(<ErrorToast message={errorMsg} />);
      }
    } else {
      const newList = (
        aiActivities.length > 0 ? aiActivities : fallbackActivities
      ).map((a, i) => (i === index ? { ...a, completed: checked } : a));
      setAiActivities(newList);
    }
  };

  const activitiesToShow =
    aiActivities && aiActivities.length > 0
      ? aiActivities
      : !user?._id
      ? fallbackActivities
      : [];

  const completedCount = activitiesToShow.filter((a) => a.completed).length;

  return (
    <div className="w-full min-h-screen px-3 md:px-6 pt-[70px] pb-8 overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold">Your Mood Journey</h1>
      <p className="mt-3 mb-3">
        Explore your mood history and gain insights into your emotional pattern
        over time. <br /> Take Control of your well-being.
      </p>

      {fetchError && (
        <div className="border-2 border-red-300 bg-red-50 text-red-600 p-3 rounded-2xl mb-4 shadow-lg">
          <span>⚠️ {fetchError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1600px] mx-auto mt-5">
        {/* Left side: mood log + suggestions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Mood Log Form Container */}
          <div className="w-full border-2 border-white rounded-2xl shadow-lg p-5">
            <MoodLogForm
              title={`${
                currentMoodTime[0].toUpperCase() + currentMoodTime.slice(1)
              } Mood Log`}
              alertVisible={alertVisible}
              setAlertVisible={setAlertVisible}
              mood={mood}
              moodChange={moodChange}
              lockOption={lockOption}
              currentMoodTime={currentMoodTime}
            />
          </div>

          {/* Suggested Activities Container */}
          <div className="w-full border-2 border-white rounded-2xl shadow-lg p-5">
            <h2 className="text-xl font-bold mb-3">Suggested Activities</h2>

            {/* Progress Section */}
            <p className="font-semibold text-lg mb-2">Progress</p>
            <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
              {activitiesToShow.length > 0
                ? `${Math.round(
                    (completedCount / activitiesToShow.length) * 100
                  )}%`
                : "0%"}
              <span className="text-sm font-medium text-gray-400 ml-2">
                ({completedCount} out of {activitiesToShow.length})
              </span>
            </p>
            <div className="w-full h-4 bg-orange-200 rounded-full overflow-hidden mt-2 mb-4">
              <div
                className="h-full bg-orange-400 transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    activitiesToShow.length
                      ? (completedCount / activitiesToShow.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            {loadingAI ? (
              <div className="w-full flex justify-center items-center p-5">
                <span className="loading loading-spinner text-orange-400"></span>
                <p className="ml-3 text-orange-400 font-semibold">
                  Fetching AI suggestions...
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {activitiesToShow.length === 0 ? (
                  <p className="text-center text-orange-400 p-4">
                    No activities have been added
                  </p>
                ) : (
                  <ul className="space-y-2 m-4">
                    {activitiesToShow.map((activity, index) => (
                      <li key={activity._id || index}>
                        <div className="p-3 flex items-start gap-3 rounded-2xl shadow-lg border-2 border-white">
                          <div className="flex justify-center items-center pt-1">
                            <input
                              type="checkbox"
                              className="w-6 h-6 accent-orange-400 cursor-pointer"
                              checked={activity.completed || false}
                              onChange={(e) =>
                                activityStatus(
                                  activity._id,
                                  e.target.checked,
                                  index
                                )
                              }
                              disabled={loadingAI}
                            />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <p className="text-orange-400 font-semibold">
                              {activity.title}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: chart */}
        <div className="lg:col-span-2">
          <div className="w-full border-2 border-white rounded-2xl shadow-lg p-5 h-full">
            <h2 className="text-xl font-bold mb-3">
              Weekly{" "}
              {currentMoodTime[0].toUpperCase() + currentMoodTime.slice(1)} Mood
              Trend
            </h2>
            <p className="mb-5 text-gray-600">
              Your mood trend over the past week.
            </p>
            <MoodTrendChart title="" key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodcheckIn;

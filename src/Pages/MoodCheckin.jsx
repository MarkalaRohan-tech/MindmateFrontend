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
  const [activity, setActivity] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [aiActivities, setAiActivities] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

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
  const selectedMood = moodMap[mood];

  const fallbackActivities = moodActivities[selectedMood];

  const moodChange = (e) => setMood(Number(e.target.value));
  const activityStatus = (e, count) => {
    if (count !== undefined) {
      setActivity(count);
    } else {
      setActivity((prev) => prev + (e.target.checked ? 1 : -1));
    }
  };


  useEffect(() => {
  if (!user?._id) return;

  const fetchActivitiesFromDB = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.get("/api/activity/getActivities", {
        params: {
          userId: user._id,
          mood,
          time: currentMoodTime,
        },
      });

      if (res.data.activities?.length > 0) {
        setAiActivities(res.data.activities);
      } else {
        setAiActivities(null);
      }
    } catch (error) {
      console.error("❌ Error fetching activities from DB:", error);
      setAiActivities(null);
    }
    setLoadingAI(false);
  };

  fetchActivitiesFromDB();

  const interval = setInterval(fetchActivitiesFromDB, 60000);

  return () => clearInterval(interval);
}, [user?._id, mood, currentMoodTime]);

  const lockOption = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/mood/update", {
        moodValue: mood,
        timeOfDay: currentMoodTime,
        userId: user._id,
      });

      if (res.status === 200) {
        toast(<SuccessToast message="Mood updated successfully" />);
        setAlertVisible(true);

        fetchAISuggession();
      } else {
        toast(<ErrorToast message="Mood update failed" />);
      }
    } catch (error) {
      console.error("Mood API error:", error);
      toast(<ErrorToast message="Mood update failed" />);
    }
  };

  const fetchAISuggession = async () => {
    let activities = [];
    setLoadingAI(true);

    try {
      const aiRes = await axios.post("/api/ai/getSuggestion", {
        prompt: `Suggest 4 unique and brainstroming short activities for mood: ${mood}, time of day: ${currentMoodTime}. 
                Respond ONLY as a JSON array of objects like this:
                [{ "title": "Activity Title", "description": "Short description" }]`,
      });

      activities = aiRes.data.activities;

      if (!Array.isArray(activities) || activities.length === 0) {
        toast(<ErrorToast message="No activities suggested." />);
        setLoadingAI(false);
        return;
      }
    } catch (error) {
      console.error("❌ Error from getActivities API:", error);
      toast(<ErrorToast message="AI suggestion fetch failed." />);
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
      console.error("❌ Error from addActivities API:", error);
      toast(<ErrorToast message="Saving activities to DB failed." />);
    }

    setLoadingAI(false);
  };

  return (
    <div className="w-[100vw] h-[100vh] px-5 pt-[70px] overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-semibold">Your Mood Journey</h1>
      <p className="mt-3 mb-3">
        Explore your mood history and gain insights into your emotional pattern
        over time. <br /> Take Control of your well-being.
      </p>

      <div className="flex flex-col lg:flex-row justify-center gap-2 items-start w-full max-w-full mt-5">
        <div className="w-1/3 flex flex-col h-1/2 gap-2 mb-5">
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

          {loadingAI ? (
            <div className="w-full flex justify-center items-center p-5">
              <span className="loading loading-spinner text-orange-400"></span>
              <p className="ml-3 text-orange-400 font-semibold">
                Fetching suggestions...
              </p>
            </div>
          ) : (
            <SuggestedActivity
              activities={aiActivities || fallbackActivities}
              activity={activity}
              activityStatus={activityStatus}
            />
          )}
        </div>

        <div className="w-2/3">
          <MoodTrendChart
            title={`Weekly ${
              currentMoodTime[0].toUpperCase() + currentMoodTime.slice(1)
            } Mood Trend`}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodcheckIn;

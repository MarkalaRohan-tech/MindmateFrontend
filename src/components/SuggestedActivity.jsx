import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const SuggestedActivity = ({ activities = [], activity, activityStatus }) => {
  const { user } = useAuth();
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Fetch user saved activities on mount
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/api/user/getUserActivities/${user._id}`);
        setSelectedActivities(res.data.activities || []);
      } catch (err) {
        console.error("❌ Failed to fetch user activities:", err);
      }
    };

    fetchUserActivities();
  }, [user?._id]);

  useEffect(() => {
    // sync with parent whenever saved or toggled
    activityStatus({ target: { checked: true } }, selectedActivities.length);
  }, [selectedActivities]);


  // Handle checkbox
  const handleCheckbox = async (e, activityId) => {
    activityStatus(e);

    try {
      if (e.target.checked) {
        await axios.post("/api/user/addActivity", {
          userId: user._id,
          activityId,
        });
        setSelectedActivities((prev) => [...prev, activityId]);
      } else {
        await axios.post("/api/user/removeActivity", {
          userId: user._id,
          activityId,
        });
        setSelectedActivities((prev) => prev.filter((id) => id !== activityId));
      }
    } catch (err) {
      console.error("❌ Activity update failed:", err);
    }
  };

  return (
    <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg ">
      <h1 className="text-xl font-bold">Suggested Activities</h1>
      <p className="my-2">Activities suggested based on your mood.</p>

      <p className="text-2xl text-orange-400 mt-2 font-bold mb-2">
        {activity * 25}% &nbsp;
        <span className="text-sm font-medium text-gray-400">
          ({activity} out of {activities.length})
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
        {activities.length > 0 ? (
          <ul>
            {activities.map((act, index) => (
              <li key={index}>
                <div className="p-3 my-2 grid grid-cols-[20%_80%] rounded-2xl shadow-lg border-2 border-white">
                  <div className="flex justify-center items-center">
                    <input
                      type="checkbox"
                      className="w-6 h-6 accent-orange-400 cursor-pointer"
                      checked={selectedActivities.includes(act._id)}
                      onChange={(e) => handleCheckbox(e, act._id)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-orange-400 font-semibold">{act.title}</p>
                    <p className="text-gray-500 text-sm">{act.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-5 text-center text-gray-500 italic">
            No activities found. Try again later.
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedActivity;

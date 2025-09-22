import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const MoodLogForm = ({
  title,
  alertVisible,
  setAlertVisible,
  mood,
  moodChange,
  lockOption,
  currentMoodTime,
}) => {
  const { user } = useAuth();
  const moodOptions = [
    { id: 1, icon: "sentiment_sad", checkedClass: "peer-checked:text-red-400" },
    {
      id: 2,
      icon: "sentiment_dissatisfied",
      checkedClass: "peer-checked:text-orange-400",
    },
    {
      id: 3,
      icon: "sentiment_neutral",
      checkedClass: "peer-checked:text-yellow-400",
    },
    {
      id: 4,
      icon: "sentiment_calm",
      checkedClass: "peer-checked:text-green-400",
    },
    {
      id: 5,
      icon: "sentiment_satisfied",
      checkedClass: "peer-checked:text-green-600",
    },
  ];

  useEffect(() => {
    const checkMoodLog = async () => {
      try {
        const res = await axios.get(`/api/mood/check`, {
          params: {
            userId: user._id,
            timeOfDay: currentMoodTime,
          },
        });

        if (res.data?.moodValue >= 1) {
          setAlertVisible(true);
        }
      } catch (err) {
        console.error("Error checking mood log:", err);
      }
    };

    if (user?._id) {
      checkMoodLog();
    }
  }, [user, currentMoodTime, setAlertVisible]);

  return (
    <form
      onSubmit={lockOption}
      className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-5 rounded-2xl shadow-lg "
    >
      <h1 className="text-xl font-bold">{title}</h1>
      <p>Record Your mood</p>

      {alertVisible ? (
        <div role="alert" className="mt-5 mb-5 alert alert-info">      
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{`${title.split(" ")[0]} mood logged!`}</span>
        </div>
      ) : (
        <>
          <div className="mood flex flex-row gap-5 mt-5 mb-5 justify-center">
            {moodOptions.map(({ id, icon, checkedClass }) => (
              <label key={id} htmlFor={icon} className="cursor-pointer">
                <input
                  type="radio"
                  name="mood"
                  id={icon}
                  value={id}
                  className="hidden peer"
                  onChange={moodChange}
                  defaultChecked={id === 3}
                />
                <span
                  style={{ fontSize: "48px" }}
                  className={`material-symbols-outlined text-5xl text-gray-700 transition-colors ${checkedClass}`}
                >
                  {icon}
                </span>
              </label>
            ))}
          </div>
          <button type="submit" className="moodLock btn bg-orange-400">
            <b className="text-white">Submit</b>
          </button>
        </>
      )}
    </form>
  );
};

export default MoodLogForm;

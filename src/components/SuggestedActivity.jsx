// src/components/SuggestedActivity.jsx
import React from "react";

const SuggestedActivity = ({ activities = [], activityStatus }) => {
  // compute progress
  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full p-4 rounded-md shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Suggested Activities</h3>
        <div className="text-sm">{progress}% done</div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div style={{ width: `${progress}%` }} className="h-2 rounded-full bg-green-400"></div>
      </div>

      <ul className="space-y-3">
        {activities.map((a, idx) => (
          <li key={a._id || idx} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={!!a.completed}
              onChange={(e) => activityStatus(a._id, e.target.checked, idx)}
              className="checkbox"
            />

            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-600">{a.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedActivity;
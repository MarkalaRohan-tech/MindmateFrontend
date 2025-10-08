import React, { useState, useEffect, useContext } from "react";
import {
  Award,
  Activity,
  Calendar,
  Mail,
  Phone,
  Trophy,
  Star,
  Clock,
  Heart,
  BookOpen,
  Users,
  Lock,
  CheckCircle,
  Frown,
  Meh,
  Smile,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";

import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = user?._id;
        const res = await axios.get(`/api/profile/${userId}`);
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 1:
        return <Frown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
      case 2:
        return <Frown className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />;
      case 3:
        return <Meh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
      case 4:
        return <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 5:
        return <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />;
      default:
        return <Meh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getActivityIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("exercise") || lowerTitle.includes("workout"))
      return <Activity className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (lowerTitle.includes("meditation") || lowerTitle.includes("mindful"))
      return <Heart className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (lowerTitle.includes("journal") || lowerTitle.includes("write"))
      return <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (lowerTitle.includes("social") || lowerTitle.includes("friend"))
      return <Users className="w-3 h-3 sm:w-4 sm:h-4" />;
    return <Star className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeBadgeClasses = (time) => {
    if (theme === "light") {
      switch (time) {
        case "morning":
          return "bg-yellow-100 text-yellow-800";
        case "afternoon":
          return "bg-orange-100 text-orange-800";
        case "evening":
          return "bg-purple-100 text-purple-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (time) {
        case "morning":
          return "bg-yellow-900/30 text-yellow-300";
        case "afternoon":
          return "bg-orange-900/30 text-orange-300";
        case "evening":
          return "bg-purple-900/30 text-purple-300";
        default:
          return "bg-gray-700 text-gray-300";
      }
    }
  };

  const getTimeIcon = (time) => {
    if (time === "morning")
      return <Sunrise className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />;
    if (time === "afternoon")
      return <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
    return <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 pt-16 sm:pt-20 flex justify-center items-center">
        <div className="text-xl sm:text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 pt-16 sm:pt-20 flex justify-center items-center">
        <div className="text-xl sm:text-2xl">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 pb-6 overflow-x-hidden overflow-y-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-5">
        Your Wellness Profile
      </h1>

      <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-5 items-start w-full max-w-full">
        {/* LEFT SIDE - Profile Card & Stats */}
        <div className="w-full lg:w-2/3">
          {/* Profile Card */}
          <div
            className={`border-2 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-5 ${
              theme === "light"
                ? "border-white bg-white"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Profile Image with Evolution */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-orange-400 shadow-xl">
                  <img
                    src={profileData.stats.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                  Level {profileData.stats.level}
                </div>
                <div className="absolute -top-2 -left-2 bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
                  {profileData.stats.evolutionStage}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center sm:text-left w-full">
                <h2
                  className={`text-xl sm:text-2xl md:text-3xl font-bold break-words ${
                    theme === "light" ? "text-gray-800" : "text-white"
                  }`}
                >
                  {profileData.user.fullname}
                </h2>
                <p className="text-orange-500 font-semibold text-base sm:text-lg break-words">
                  @{profileData.user.username}
                </p>
                <div
                  className={`flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 text-xs sm:text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 break-all">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate max-w-full">
                      {profileData.user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    {profileData.user.phone}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    Joined {formatDate(profileData.user.joinDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-4 sm:mt-6">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Level Progress
                </span>
                <span
                  className={`text-xs sm:text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {profileData.stats.progressToNextLevel}% to next level
                </span>
              </div>
              <progress
                className={`progress w-full h-2 sm:h-3 ${
                  theme === "light"
                    ? "bg-orange-200 text-orange-500"
                    : "bg-orange-900/30 text-orange-500"
                }`}
                value={profileData.stats.progressToNextLevel}
                max="100"
              ></progress>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5">
            <div
              className={`border-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-center flex flex-col items-center gap-1 sm:gap-2 ${
                theme === "light"
                  ? "border-white bg-white"
                  : "border-gray-700 bg-gray-800"
              }`}
            >
              <div className="flex justify-center items-center gap-1">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-500" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500">
                  {profileData.stats.totalPoints}
                </div>
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Total Points
              </div>
            </div>
            <div
              className={`border-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-center flex flex-col items-center gap-1 sm:gap-2 ${
                theme === "light"
                  ? "border-white bg-white"
                  : "border-gray-700 bg-gray-800"
              }`}
            >
              <div className="flex justify-center items-center gap-1">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">
                  {profileData.stats.totalActivities}
                </div>
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Activities
              </div>
            </div>
            <div
              className={`border-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-center flex flex-col items-center gap-1 sm:gap-2 ${
                theme === "light"
                  ? "border-white bg-white"
                  : "border-gray-700 bg-gray-800"
              }`}
            >
              <div className="flex justify-center items-center gap-1">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500">
                  {profileData.stats.journalCount ?? 0}
                </div>
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Journal Count
              </div>
            </div>
            <div
              className={`border-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-center flex flex-col items-center gap-1 sm:gap-2 ${
                theme === "light"
                  ? "border-white bg-white"
                  : "border-gray-700 bg-gray-800"
              }`}
            >
              <div className="flex justify-center items-center gap-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-500" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">
                  {profileData.stats.communityStreak ?? 0}
                </div>
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Community Count
              </div>
            </div>
            <div
              className={`border-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-center flex flex-col items-center gap-1 sm:gap-2 col-span-2 sm:col-span-1 ${
                theme === "light"
                  ? "border-white bg-white"
                  : "border-gray-700 bg-gray-800"
              }`}
            >
              <div className="flex justify-center items-center gap-1">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-500" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-500">
                  {profileData.stats.selfCareStreak ?? 0}
                </div>
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Self-Care Streak
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div
            className={`border-2 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg ${
              theme === "light"
                ? "border-white bg-white"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                Recent Activities
              </h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {profileData.recentActivities.length > 0 ? (
                profileData.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 rounded-xl ${
                      theme === "light"
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-gray-700/50 border border-gray-600"
                    }`}
                  >
                    <div className="text-xl sm:text-2xl">
                      {getMoodIcon(activity.mood)}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        {getActivityIcon(activity.title)}
                        <span
                          className={`font-semibold text-sm sm:text-base break-words ${
                            theme === "light"
                              ? "text-gray-800"
                              : "text-gray-200"
                          }`}
                        >
                          {activity.title}
                        </span>
                        <span
                          className={`text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1 ${getTimeBadgeClasses(
                            activity.time
                          )}`}
                        >
                          {getTimeIcon(activity.time)} {activity.time}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm mt-1 break-words ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {activity.description}
                      </p>
                    </div>
                    <div
                      className={`text-xs self-end sm:self-auto ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {formatDate(activity.date)}
                    </div>
                  </div>
                ))
              ) : (
                <p
                  className={`text-center py-4 text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No recent activities
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Achievements */}
        <div className="w-full lg:w-1/3">
          <div
            className={`border-2 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg ${
              theme === "light"
                ? "border-white bg-white"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <div className="flex flex-wrap justify-between items-center mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                Achievements
              </h3>
              <span
                className={`text-xs sm:text-sm px-2 py-1 rounded-full font-medium ${
                  theme === "light"
                    ? "bg-green-100 text-green-700"
                    : "bg-green-900/30 text-green-400"
                }`}
              >
                {profileData.badges.unlocked.length}/
                {profileData.badges.totalAvailable} Unlocked
              </span>
            </div>

            {/* Achievement Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Overall Progress
                </span>
                <span
                  className={`text-xs sm:text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {Math.round(
                    (profileData.badges.unlocked.length /
                      profileData.badges.totalAvailable) *
                      100
                  )}
                  %
                </span>
              </div>
              <progress
                className={`progress w-full h-2 ${
                  theme === "light"
                    ? "bg-green-200 text-green-500"
                    : "bg-green-900/30 text-green-500"
                }`}
                value={profileData.badges.unlocked.length}
                max={profileData.badges.totalAvailable}
              ></progress>
            </div>

            {/* Unlocked Badges */}
            <div className="mb-4 sm:mb-6">
              <h4
                className={`font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                Unlocked Badges
              </h4>
              <div className="space-y-2 sm:space-y-3 max-h-56 sm:max-h-64 overflow-y-auto">
                {profileData.badges.unlocked.map((badge, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl ${
                      theme === "light"
                        ? "bg-green-50 border border-green-200"
                        : "bg-green-900/20 border border-green-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 ${
                        theme === "light" ? "bg-white" : ""
                      }`}
                    >
                      <img
                        src={badge.logo}
                        alt={badge.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm sm:text-base break-words ${
                          theme === "light"
                            ? "text-green-700"
                            : "text-green-400"
                        }`}
                      >
                        {badge.title}
                      </p>
                      <p
                        className={`text-xs break-words ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            <div>
              <h4
                className={`font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                Locked Badges ({profileData.badges.locked.length} remaining)
              </h4>
              <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto">
                {profileData.badges.locked.slice(0, 3).map((badge, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl opacity-70 ${
                      theme === "light"
                        ? "bg-gray-100 border border-gray-300"
                        : "bg-gray-700/30 border border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden grayscale flex-shrink-0 ${
                        theme === "light" ? "bg-white" : "bg-gray-700"
                      }`}
                    >
                      <img
                        src={badge.logo}
                        alt={badge.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm sm:text-base break-words ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {badge.title}
                      </p>
                      <p
                        className={`text-xs break-words ${
                          theme === "light" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
                {profileData.badges.locked.length > 3 && (
                  <div
                    className={`text-center py-2 text-xs sm:text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    +{profileData.badges.locked.length - 3} more badges to
                    unlock
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

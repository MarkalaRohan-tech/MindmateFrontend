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
        return <Frown className="w-5 h-5 text-blue-400" />;
      case 2:
        return <Frown className="w-5 h-5 text-indigo-400" />;
      case 3:
        return <Meh className="w-5 h-5 text-gray-500" />;
      case 4:
        return <Smile className="w-5 h-5 text-green-500" />;
      case 5:
        return <Smile className="w-5 h-5 text-yellow-400" />;
      default:
        return <Meh className="w-5 h-5 text-gray-400" />;
    }
  };


  const getActivityIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("exercise") || lowerTitle.includes("workout"))
      return <Activity className="w-4 h-4" />;
    if (lowerTitle.includes("meditation") || lowerTitle.includes("mindful"))
      return <Heart className="w-4 h-4" />;
    if (lowerTitle.includes("journal") || lowerTitle.includes("write"))
      return <BookOpen className="w-4 h-4" />;
    if (lowerTitle.includes("social") || lowerTitle.includes("friend"))
      return <Users className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeBadgeClasses = (time) => {
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
  };


  const getTimeIcon = (time) => {
    if (time === "morning")
      return <Sunrise className="w-4 h-4 text-orange-400" />;
    if (time === "afternoon")
      return <Sun className="w-4 h-4 text-yellow-500" />;
    return <Moon className="w-4 h-4 text-purple-500" />;
  };


  if (loading) {
    return (
      <div className="w-[100vw] h-[100vh] px-3 pt-[70px] overflow-x-hidden flex justify-center items-center">
        <div className="text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-[100vw] h-[100vh] px-3 pt-[70px] overflow-x-hidden flex justify-center items-center">
        <div className="text-2xl">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="w-[100vw] h-[100vh] px-3 pt-[70px] overflow-x-hidden overflow-y-auto">
      <h1 className="text-2xl md:text-4xl font-semibold mb-5">
        Your Wellness Profile
      </h1>

      <div className="flex flex-col xl:flex-row justify-center gap-5 items-start w-full max-w-full">
        {/* LEFT SIDE - Profile Card & Stats */}
        <div className="w-full xl:w-2/3">
          {/* Profile Card */}
          <div className="border-2 border-white p-6 rounded-2xl shadow-lg mb-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image with Evolution */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-orange-400 shadow-xl">
                  <img
                    src={profileData.stats.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png"; // Fallback image
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Level {profileData.stats.level}
                </div>
                <div className="absolute -top-2 -left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {profileData.stats.evolutionStage}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {profileData.user.fullname}
                  </h2>
                  <p className="text-orange-500 font-semibold text-lg">
                    @{profileData.user.username}
                  </p>
                  <div className="flex flex-col md:flex-row gap-3 mt-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profileData.user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profileData.user.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(profileData.user.joinDate)}
                    </div>
                  </div>
                </>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Level Progress</span>
                <span className="text-sm text-gray-500">
                  {profileData.stats.progressToNextLevel}% to next level
                </span>
              </div>
              <progress
                className="progress bg-orange-200 text-orange-500 w-full h-3"
                value={profileData.stats.progressToNextLevel}
                max="100"
              ></progress>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
            <div className="border-2 border-white p-4 rounded-2xl shadow-lg text-center flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-1">
                <Trophy className="w-6 h-6 text-orange-500" />
                <div className="text-3xl font-bold text-orange-500">
                  {profileData.stats.totalPoints}
                </div>
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="border-2 border-white p-4 rounded-2xl shadow-lg text-center flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-1">
                <Activity className="w-6 h-6 text-blue-500" />
                <div className="text-3xl font-bold text-blue-500">
                  {profileData.stats.totalActivities}
                </div>
              </div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
            <div className="border-2 border-white p-4 rounded-2xl shadow-lg text-center flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-1">
                <BookOpen className="w-6 h-6 text-green-500" />
                <div className="text-3xl font-bold text-green-500">
                  {profileData.stats.journalCount ?? 0}
                </div>
              </div>
              <div className="text-sm text-gray-600">Journal Count</div>
            </div>
            <div className="border-2 border-white p-4 rounded-2xl shadow-lg text-center flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-1">
                <Users className="w-6 h-6 text-purple-500" />
                <div className="text-3xl font-bold text-purple-500">
                  {profileData.stats.communityStreak ?? 0}
                </div>
              </div>
              <div className="text-sm text-gray-600">Community Count</div>
            </div>
            <div className="border-2 border-white p-4 rounded-2xl shadow-lg text-center flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-1">
                <Heart className="w-6 h-6 text-teal-500" />
                <div className="text-3xl font-bold text-teal-500">
                  {profileData.stats.selfCareStreak ?? 0}
                </div>
              </div>
              <div className="text-sm text-gray-600">Self-Care Streak</div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="border-2 border-white p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activities
              </h3>
            </div>

            <div className="space-y-3">
              {profileData.recentActivities.length > 0 ? (
                profileData.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="text-2xl">{getMoodIcon(activity.mood)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.title)}
                        <span className="font-semibold">{activity.title}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${getTimeBadgeClasses(
                            activity.time
                          )}`}
                        >
                          {getTimeIcon(activity.time)} {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(activity.date)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Achievements */}
        <div className="w-full xl:w-1/3">
          <div className="border-2 border-white p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </h3>
              <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {profileData.badges.unlocked.length}/
                {profileData.badges.totalAvailable} Unlocked
              </span>
            </div>

            {/* Achievement Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Overall Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.round(
                    (profileData.badges.unlocked.length /
                      profileData.badges.totalAvailable) *
                      100
                  )}
                  %
                </span>
              </div>
              <progress
                className="progress bg-green-200 text-green-500 w-full h-2"
                value={profileData.badges.unlocked.length}
                max={profileData.badges.totalAvailable}
              ></progress>
            </div>

            {/* Unlocked Badges */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Unlocked Badges
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {profileData.badges.unlocked.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={badge.logo}
                        alt={badge.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-700">
                        {badge.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Badges (Sample) */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Locked Badges ({profileData.badges.locked.length} remaining)
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {profileData.badges.locked.slice(0, 3).map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-60"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden grayscale">
                      <img
                        src={badge.logo}
                        alt={badge.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-500">
                        {badge.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
                {profileData.badges.locked.length > 3 && (
                  <div className="text-center py-2 text-gray-500">
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

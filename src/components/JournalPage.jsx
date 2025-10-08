import React, { useEffect, useRef, useState, useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { ThemeContext } from "../Context/ThemeContext";
import api from "../Utils/axiosInstance";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const JournalPage = () => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [currentDay, setCurrentDay] = useState(getCurrentDayName());
  const [logStatus, setLogStatus] = useState([]);
  const [journalView, setJournalView] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  // ===========================
  // ✅ Helper Functions
  // ===========================
  function getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  function getCurrentDayName() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  }

  function canAccessDay(dayName) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayIndex = new Date().getDay();
    const dayIndex = days.indexOf(dayName);
    return dayIndex <= currentDayIndex;
  }

  function getDayStatus(dayName) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayIndex = new Date().getDay();
    const dayIndex = days.indexOf(dayName);
    const journal = journalView.find((j) => j.day === dayName);

    const hasContent =
      journal?.exists &&
      journal.content &&
      journal.content !== "<p>No Data available</p>" &&
      journal.content.trim() !== "" &&
      journal.content !== "<p>Start writing your journal entry...</p>" &&
      journal.content !== "<p></p>";

    if (dayIndex < currentDayIndex) return hasContent ? "completed" : "missing";
    if (dayIndex === currentDayIndex)
      return hasContent ? "completed" : "pending";
    return "upcoming";
  }

  function getUserId() {
    return user?.id || user?.uid || user?._id;
  }

  // ===========================
  // ✅ Early return if not logged in
  // ===========================
  if (!getUserId()) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center ${
          theme === "light" ? "bg-gray-100" : "bg-gray-900"
        }`}
      >
        <div
          className={`text-center p-6 sm:p-8 rounded-lg shadow-lg max-w-md mx-4 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2
            className={`text-2xl font-bold mb-3 ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            Authentication Required
          </h2>
          <p
            className={`text-sm mb-4 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Please log in to access your journal.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // ✅ Initialize Quill Editor
  // ===========================
  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
            ["link", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });
      loadJournalEntry(currentDay);
    }
  }, []);

  // ===========================
  // ✅ Week change detection
  // ===========================
  useEffect(() => {
    initializeWeeklyData();
    const interval = setInterval(() => {
      const newWeek = getCurrentWeek();
      if (newWeek !== currentWeek) {
        setCurrentWeek(newWeek);
        initializeWeeklyData();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentWeek]);

  const initializeWeeklyData = async () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const initialLogStatus = days.map((day, index) => ({
      Sno: (index + 1).toString(),
      Day: day,
      status: "pending",
    }));
    setLogStatus(initialLogStatus);
    await loadWeeklyJournals();
  };

  // ===========================
  // ✅ Load Weekly Journals (Axios)
  // ===========================
  const loadWeeklyJournals = async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      if (!userId) return;

      const response = await api.get(`/api/journal/week/${currentWeek}`, {
        params: { year: new Date().getFullYear(), userId },
      });

      const { data } = response;
      if (!data.success) throw new Error(data.error || "API error");

      const journals = data.data || [];
      setJournalView(journals);

      const updatedLogStatus = journals.map((j, index) => ({
        Sno: (index + 1).toString(),
        Day: j.day,
        status: getDayStatus(j.day),
      }));
      setLogStatus(updatedLogStatus);

      const todayEntry = journals.find((j) => j.day === currentDay);
      if (todayEntry && todayEntry.exists && quillInstanceRef.current) {
        const content = todayEntry.content || "";
        quillInstanceRef.current.root.innerHTML =
          content !== "<p>No Data available</p>"
            ? content
            : "<p>Start writing your journal entry...</p>";
      } else if (quillInstanceRef.current) {
        quillInstanceRef.current.root.innerHTML =
          "<p>Start writing your journal entry...</p>";
      }
    } catch (error) {
      console.error("Error loading weekly journals:", error);
      setSaveStatus("Error loading journals");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // ===========================
  // ✅ Load Journal Entry (Axios)
  // ===========================
  const loadJournalEntry = async (day) => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      if (!userId) return;

      const response = await api.get(`/api/journal/${currentWeek}/${day}`, {
        params: { userId },
      });

      const { data } = response;
      if (data.success && data.data && quillInstanceRef.current) {
        const content = data.data.content || "";
        quillInstanceRef.current.root.innerHTML =
          content && content !== "<p>No Data available</p>"
            ? content
            : "<p>Start writing your journal entry...</p>";
      }
    } catch (error) {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.root.innerHTML =
          "<p>Start writing your journal entry...</p>";
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================
  // ✅ Save Journal Entry (Axios)
  // ===========================
  const saveJournalEntry = async () => {
    if (!quillInstanceRef.current) {
      setSaveStatus("Editor not ready");
      return setTimeout(() => setSaveStatus(""), 2000);
    }

    const content = quillInstanceRef.current.root.innerHTML;
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!textContent || textContent === "Start writing your journal entry...") {
      setSaveStatus("Please write something before saving");
      return setTimeout(() => setSaveStatus(""), 2000);
    }

    const userId = getUserId();
    if (!userId) {
      setSaveStatus("Authentication required");
      return setTimeout(() => setSaveStatus(""), 2000);
    }

    try {
      setIsLoading(true);
      setSaveStatus("Saving...");

      const existingEntry = journalView.find(
        (j) => j.day === currentDay && j.exists
      );

      const method = existingEntry ? "put" : "post";
      const url = existingEntry
        ? `/api/journal/${currentWeek}/${currentDay}`
        : `/api/journal`;

      const requestBody = {
        week: currentWeek,
        day: currentDay,
        content,
        userId,
        wordCount: textContent.split(/\s+/).length,
        characterCount: textContent.length,
      };

      const response = await api[method](url, requestBody);
      const data = response.data;

      if (!data.success) throw new Error(data.error || "Failed to save");

      setJournalView((prev) =>
        prev.map((j) =>
          j.day === currentDay
            ? {
                ...j,
                content,
                exists: true,
                wordCount: requestBody.wordCount,
                characterCount: requestBody.characterCount,
              }
            : j
        )
      );

      setTimeout(() => {
        setLogStatus((prev) =>
          prev.map((log) =>
            log.Day === currentDay
              ? { ...log, status: getDayStatus(currentDay) }
              : log
          )
        );
      }, 100);

      setSaveStatus("Saved successfully!");
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setSaveStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // ===========================
  // ✅ Switch Day
  // ===========================
  const switchToDay = (day) => {
    if (!canAccessDay(day)) return;
    setCurrentDay(day);
    loadJournalEntry(day);
  };

  // ===========================
  // ✅ UI Layout (identical to yours)
  // ===========================
  return (
    <div
      className={`fixed inset-0 pt-[60px] sm:pt-[70px] overflow-hidden ${
        theme === "light" ? "bg-white" : "bg-gray-900"
      }`}
    >
      <div className="h-full grid grid-cols-1 lg:grid-cols-[35%_65%] xl:grid-cols-[40%_60%]">
        {/* Left Side */}
        <div
          className={`hidden lg:flex flex-col justify-center items-center gap-4 px-8 py-6 ${
            theme === "light" ? "bg-white" : "bg-gray-900"
          }`}
        >
          <h1
            className={`text-3xl font-semibold ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            Journal Writing
          </h1>
          <p
            className={`text-base text-left ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            A dedicated space to reflect on your day, track your growth, and
            express your thoughts freely.
          </p>
          <img
            src="/Journal.png"
            alt="Journal Illustration"
            className="w-full max-w-[400px]"
          />
        </div>

        {/* Right Side */}
        <div className="h-full flex flex-col p-5 overflow-hidden">
          <div
            className={`h-full flex flex-col shadow-2xl border-2 rounded-lg overflow-hidden ${
              theme === "light"
                ? "bg-white border-white"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4">
              <h1 className="text-xl font-bold">
                Daily Journal - {currentDay}
              </h1>
              <p className="text-sm text-orange-100">
                Week {currentWeek} of {new Date().getFullYear()}
              </p>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    const accessible = canAccessDay(day);
                    return (
                      <button
                        key={day}
                        onClick={() => switchToDay(day)}
                        disabled={!accessible}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                          currentDay === day
                            ? "bg-orange-400 text-white"
                            : accessible
                            ? theme === "light"
                              ? "bg-gray-200 hover:bg-gray-300"
                              : "bg-gray-700 hover:bg-gray-600"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  {saveStatus && (
                    <span
                      className={`text-sm font-medium ${
                        saveStatus.includes("success")
                          ? "text-green-600"
                          : saveStatus.includes("Error")
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {saveStatus}
                    </span>
                  )}
                  <button
                    onClick={saveJournalEntry}
                    disabled={isLoading || !canAccessDay(currentDay)}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div
                  ref={editorRef}
                  id="editor"
                  className={`h-full border-2 rounded-lg ${
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-gray-900 border-gray-700"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;

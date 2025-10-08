import React, { useEffect, useRef, useState, useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { ThemeContext } from "../Context/ThemeContext";

const JournalPage = () => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [currentDay, setCurrentDay] = useState(getCurrentDayName());
  const [logStatus, setLogStatus] = useState([]);
  const [journalView, setJournalView] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  // Helper Functions
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

  // Early return if user is not authenticated
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
          <div className="text-red-500 text-4xl sm:text-6xl mb-3 sm:mb-4">
            ⚠️
          </div>
          <h2
            className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            Authentication Required
          </h2>
          <p
            className={`text-sm sm:text-base mb-3 sm:mb-4 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Please log in to access your journal.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Initialize Quill Editor
  useEffect(() => {
    if (window.Quill && editorRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new window.Quill(editorRef.current, {
        theme: theme === "light" ? "snow" : "snow",
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

  // Week change detection
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

  const loadWeeklyJournals = async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();

      if (!userId) {
        console.error("No user ID available for loading weekly journals");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/journal/week/${currentWeek}?year=${new Date().getFullYear()}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed - user may need to login again");
          setSaveStatus("Authentication error");
          setTimeout(() => setSaveStatus(""), 3000);
          return;
        } else if (response.status === 404) {
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const emptyJournals = days.map((day) => ({
            day,
            exists: false,
            content: null,
            wordCount: 0,
            characterCount: 0,
          }));
          setJournalView(emptyJournals);

          const updatedLogStatus = emptyJournals.map((j, index) => ({
            Sno: (index + 1).toString(),
            Day: j.day,
            status: getDayStatus(j.day),
          }));
          setLogStatus(updatedLogStatus);

          if (quillInstanceRef.current) {
            quillInstanceRef.current.root.innerHTML =
              "<p>Start writing your journal entry...</p>";
          }
          return;
        }
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "API error");
      }

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
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJournalEntry = async (day) => {
    try {
      setIsLoading(true);
      const userId = getUserId();

      if (!userId) {
        console.error("No user ID available for loading journal entry");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/journal/${currentWeek}/${day}?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const content = data.data.content || "";
          if (quillInstanceRef.current) {
            quillInstanceRef.current.root.innerHTML =
              content && content !== "<p>No Data available</p>"
                ? content
                : "<p>Start writing your journal entry...</p>";
          }
        }
      } else if (response.status === 404) {
        if (quillInstanceRef.current) {
          quillInstanceRef.current.root.innerHTML =
            "<p>Start writing your journal entry...</p>";
        }
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

  const saveJournalEntry = async () => {
    if (!quillInstanceRef.current) {
      setSaveStatus("Editor not ready");
      setTimeout(() => setSaveStatus(""), 2000);
      return;
    }

    const content = quillInstanceRef.current.root.innerHTML;
    const textContent = content.replace(/<[^>]*>/g, "").trim();

    if (!textContent || textContent === "Start writing your journal entry...") {
      setSaveStatus("Please write something before saving");
      setTimeout(() => setSaveStatus(""), 2000);
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setSaveStatus("Authentication required");
      setTimeout(() => setSaveStatus(""), 2000);
      return;
    }

    try {
      setIsLoading(true);
      setSaveStatus("Saving...");

      const existingEntry = journalView.find(
        (j) => j.day === currentDay && j.exists
      );

      const method = existingEntry ? "PUT" : "POST";
      const url = existingEntry
        ? `${API_BASE_URL}/journal/${currentWeek}/${currentDay}`
        : `${API_BASE_URL}/journal`;

      const requestBody = {
        week: currentWeek,
        day: currentDay,
        content,
        userId,
        wordCount: textContent.split(/\s+/).length,
        characterCount: textContent.length,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed");
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save");
      }

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

  const switchToDay = (day) => {
    if (!canAccessDay(day)) return;
    setCurrentDay(day);
    loadJournalEntry(day);
  };

  return (
    <div
      className={`fixed inset-0 pt-[60px] sm:pt-[70px] overflow-hidden ${
        theme === "light" ? "bg-white" : "bg-gray-900"
      }`}
    >
      <div className="h-full grid grid-cols-1 lg:grid-cols-[35%_65%] xl:grid-cols-[40%_60%]">
        {/* Left Side - Info Section */}
        <div
          className={`hidden lg:flex flex-col justify-center items-center gap-3 md:gap-4 lg:gap-5 px-4 md:px-6 lg:px-8 py-4 overflow-y-auto ${
            theme === "light" ? "bg-white" : "bg-gray-900"
          }`}
        >
          <h1
            className={`text-2xl md:text-3xl lg:text-4xl font-semibold text-left w-full ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            Journal Writing
          </h1>
          <p
            className={`text-sm md:text-base lg:text-lg leading-relaxed text-left w-full ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            A dedicated space to reflect on your day, track your growth, and
            express your thoughts freely.
          </p>
          <img
            src="/Journal.png"
            alt="Journal Illustration"
            className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[450px] object-contain"
          />
        </div>

        {/* Right Side - Editor Section */}
        <div className="h-full flex flex-col p-3 sm:p-4 md:p-5 lg:p-6 overflow-hidden">
          <div
            className={`h-full flex flex-col shadow-xl sm:shadow-2xl border sm:border-2 rounded-lg overflow-hidden ${
              theme === "light"
                ? "bg-white border-gray-200 sm:border-white"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-3 sm:p-4 flex-shrink-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                Daily Journal - {currentDay}
              </h1>
              <p className="text-xs sm:text-sm text-orange-100">
                Week {currentWeek} of {new Date().getFullYear()}
              </p>
            </div>

            {/* Editor Container */}
            <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5 overflow-hidden">
              {/* Day Selector and Save Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4 flex-shrink-0">
                {/* Day Buttons - Scrollable on mobile */}
                <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-thin scrollbar-thumb-gray-300">
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
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                          currentDay === day
                            ? "bg-orange-400 text-white"
                            : accessible
                            ? theme === "light"
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            : theme === "light"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                            : "bg-gray-800 text-gray-600 cursor-not-allowed opacity-50"
                        }`}
                        title={
                          !accessible ? "Future days are not accessible" : ""
                        }
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  {saveStatus && (
                    <span
                      className={`text-xs sm:text-sm font-medium truncate ${
                        saveStatus.includes("success")
                          ? "text-green-600"
                          : saveStatus.includes("Error") ||
                            saveStatus.includes("error")
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
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
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
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quill Editor - Fills remaining space */}
              <div className="flex-1 overflow-hidden">
                <div
                  ref={editorRef}
                  id="editor"
                  className={`h-full border sm:border-2 rounded-lg ${
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-gray-900 border-gray-700"
                  }`}
                  style={{ minHeight: 0 }}
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

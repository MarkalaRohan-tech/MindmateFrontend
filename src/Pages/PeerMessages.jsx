import { useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../Context/AuthContext";
import { ThemeContext } from "../Context/ThemeContext";
import api from "../Utils/axiosInstance";

const API_BASE = import.meta.env.VITE_API_URL;

const PeerMessages = () => {
  const { user } = useAuth();
  const senderId = user._id;
  const { theme } = useContext(ThemeContext);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const socket = useRef(
    io(API_BASE, {
      transports: ["websocket"],
      reconnection: true,
      query: { userId: senderId },
    })
  ).current;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`${API_BASE}/api/chat`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("disconnect", () => console.log("Disconnected"));

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message deleted", ({ messageId, deletedBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deleted: true, deletedBy } : msg
        )
      );
    });

    return () => {
      socket.off("chat message");
      socket.off("message deleted");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit("chat message", { senderId, content: input });
    setInput("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_BASE}/api/chat/${id}/${senderId}`);
      socket.emit("delete message", { messageId: id, userId: senderId });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div
      className={`w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-10 pt-[70px] pb-6 sm:pb-8 overflow-x-hidden transition-colors duration-300 ${
        theme === "light"
          ? "bg-white text-gray-800"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {/* Left Section */}
          <div className="flex flex-col justify-center items-start gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4 md:px-5">
            <h1
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold ${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              Peer Messaging
            </h1>
            <p
              className={`text-sm sm:text-base md:text-lg leading-relaxed ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Safe space to share your thoughts, find motivation, and gain
              clarity. Chat in real-time with empathy and support whenever you
              need it.
            </p>
            <img
              src="/chat.png"
              alt="Chat Illustration"
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] object-contain hidden sm:block"
            />
          </div>

          {/* Right Section - Chat */}
          <div
            className={`relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] flex flex-col p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl transition-colors duration-300 ${
              theme === "light"
                ? "bg-gradient-to-br from-orange-200 to-orange-400"
                : "bg-gradient-to-br from-gray-800 to-gray-700"
            }`}
          >
            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto mb-14 sm:mb-16 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${
                theme === "light" ? "bg-orange-50" : "bg-gray-800"
              }`}
            >
              <ul className="flex flex-col gap-y-2 sm:gap-y-3">
                {messages.map((msg) => {
                  const msgSenderId = msg.senderId?._id || msg.senderId;
                  const isMe = msgSenderId === senderId;

                  return (
                    <li
                      key={msg._id}
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="m-1 flex flex-col gap-0.5 sm:gap-1 max-w-[85%] sm:max-w-[80%]">
                        {/* Username */}
                        <span
                          className={`text-[10px] sm:text-xs ${
                            theme === "light"
                              ? "text-gray-500"
                              : "text-gray-400"
                          } ${isMe ? "text-end" : "text-start"}`}
                        >
                          {isMe
                            ? "You"
                            : msg.senderId?.username ||
                              msg.senderId?.fullname ||
                              "Unknown"}
                        </span>

                        {/* Message Content */}
                        <div className="flex gap-1 sm:gap-2 items-center">
                          {isMe && !msg.deleted && (
                            <button
                              onClick={() => handleDelete(msg._id)}
                              className="cursor-pointer text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors"
                              aria-label="Delete message"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                          <span
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md text-sm sm:text-base break-words ${
                              msg.deleted
                                ? theme === "light"
                                  ? "bg-gray-200 text-gray-500 italic"
                                  : "bg-gray-700 text-gray-400 italic"
                                : isMe
                                ? theme === "light"
                                  ? "bg-white text-orange-500"
                                  : "bg-gray-700 text-orange-300"
                                : theme === "light"
                                ? "bg-orange-500 text-white"
                                : "bg-orange-600 text-white"
                            }`}
                          >
                            {msg.deleted ? "Message deleted" : msg.content}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <span
                          className={`text-[9px] sm:text-[10px] ${
                            theme === "light"
                              ? "text-gray-400"
                              : "text-gray-500"
                          } ${isMe ? "text-end" : "text-start"}`}
                        >
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </li>
                  );
                })}
                <div ref={messagesEndRef} />
              </ul>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex rounded-full shadow-md overflow-hidden ${
                theme === "light"
                  ? "bg-white border border-gray-200"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send message..."
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none text-sm sm:text-base ${
                  theme === "light"
                    ? "text-gray-800 placeholder-gray-400"
                    : "text-gray-100 placeholder-gray-500 bg-gray-800"
                }`}
              />
              <button
                type="submit"
                className={`px-4 sm:px-6 py-2 sm:py-2.5 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap ${
                  theme === "light"
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerMessages;

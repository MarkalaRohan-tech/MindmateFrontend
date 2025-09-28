import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../Context/AuthContext";

const API_BASE = "http://localhost:3000";

const PeerMessages = () => {
  const { user } = useAuth();
  const senderId = user._id;

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
        const res = await axios.get(`${API_BASE}/api/chat`);
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

    // New message
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // ✅ Fix: now handles deletedBy immediately
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
      await axios.delete(`${API_BASE}/api/chat/${id}/${senderId}`);
      socket.emit("delete message", { messageId: id, userId: senderId });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="absolute top-10 m-10 w-[90%] grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 justify-center items-center">

      <div className="flex flex-col justify-center items-start gap-5 px-5">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
          Peer Messaging
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Safe space to share your thoughts, find motivation, and gain clarity.
          Chat in real-time with empathy and support whenever you need it.
        </p>
        <img src="/chat.png" alt="Chat Illustration" width={500} />
      </div>

      <div className="relative w-full h-[600px] bg-gradient-to-br from-orange-200 to-orange-400 flex flex-col p-4 rounded-2xl shadow-xl">
        <ul className="flex-1 overflow-y-auto mb-16 p-4 bg-orange-50 rounded-xl flex flex-col gap-y-3">
          {messages.map((msg) => {
            // Handle both populated and non-populated senderId
            const msgSenderId = msg.senderId?._id || msg.senderId;
            const isMe = msgSenderId === senderId;

            return (
              <li
                key={msg._id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div className="m-1 flex flex-col gap-1">
                  <span
                    className={`text-xs text-gray-500 ${
                      isMe ? "text-end" : "text-start"
                    }`}
                  >
                    {isMe
                      ? "You"
                      : msg.senderId?.username ||
                        msg.senderId?.fullname ||
                        "Unknown"}
                  </span>

                  <div className="flex gap-1 items-center">
                    {isMe && !msg.deleted && (
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="cursor-pointer text-xs text-red-500 hover:underline"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                    <span
                      className={`px-4 py-2 rounded-xl shadow-md ${
                        isMe
                          ? "bg-white text-orange-500"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {msg.deleted ? "Message deleted" : msg.content}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] text-gray-400 ${
                      isMe ? "text-end" : "text-start"
                    }`}
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

        <form
          onSubmit={handleSend}
          className="absolute bottom-4 left-4 right-4 flex bg-white rounded-full shadow-md overflow-hidden"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send message..."
            className="flex-1 px-4 py-2 focus:outline-none text-black"
          />
          <button
            type="submit"
            className="px-6 cursor-pointer bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default PeerMessages;

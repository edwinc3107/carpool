import Navbar from "./Navbar";
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "./context/UserContext";
import socket from "./socket";

function ChatRoom() {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Join socket room when ride is selected
  useEffect(() => {
    if (selectedRideId) {
      socket.emit("join_room", { roomId: selectedRideId });
    }
  }, [selectedRideId]);

  // Socket listener for messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, createdAt: new Date() }]);
    });

    return () => socket.off("receive_message");
  }, []);

  // Fetch messages for selected ride
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRideId) return;
      try {
        const res = await axios.get(`/mychats/${selectedRideId}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (user) fetchMessages();
  }, [selectedRideId]);

  // Fetch chat list
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("/mychats");
        setChats(res.data.chatRooms);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    if (user) fetchChats();
  }, [user]);

  // Send message
  const handleSendMessage = () => {
    if (!text.trim() || !selectedRideId || !user) return;

    socket.emit("send_message", {
      roomId: selectedRideId,
      message: text,
      sender: user,
    });
    setText("");
  };

  // Auto scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full min-h-screen bg-black text-lime-400">
      <Navbar />
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-5xl font-bold mb-10 text-center text-lime-400">
          Connect with Fellow Travelers
        </h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar: Chat List */}
          <div className="col-span-4 bg-gray-900 rounded-2xl shadow-lg p-5 flex flex-col">
            <h2 className="text-3xl font-semibold mb-6 text-lime-400">Chats</h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedRideId(chat._id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedRideId === chat._id
                        ? "bg-lime-600 shadow-lg"
                        : "bg-gray-800 hover:bg-lime-700/40"
                    }`}
                  >
                    {chat.ride ? (
                      <>
                        <h3 className="font-semibold text-lg">
                          {chat.ride.from} ➡ {chat.ride.to}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {new Date(chat.ride.rideDate).toLocaleDateString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">Ride info not available</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No chats yet!</p>
              )}
            </div>
          </div>

          {/* Chat Window */}
<div className="col-span-8 flex flex-col bg-gray-900 rounded-2xl shadow-lg h-[70vh]">
  {selectedRideId ? (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender?._id === user?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl shadow max-w-[70%] ${
                  msg.sender?._id === user?._id
                    ? "bg-lime-500 text-black"
                    : "bg-gray-800 text-white"
                }`}
              >
                <p className="font-semibold text-sm">
                  {msg.sender?.name || "Anonymous"}
                </p>
                <p className="mt-1">{msg.message}</p>
                <p className="text-xs text-gray-300 mt-1 text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No messages yet. Say hi! 👋</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input (Sticky at bottom) */}
      <div className="p-4 border-t border-gray-700 flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 p-3 rounded-full bg-black border border-white/30 text-white focus:outline-none focus:border-lime-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 rounded-full font-semibold shadow-md transition"
        >
          Send
        </button>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center h-full text-gray-400 text-xl">
      Select a ride to start chatting
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

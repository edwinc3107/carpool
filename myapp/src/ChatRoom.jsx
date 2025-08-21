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
  const shouldAutoScrollRef = useRef(false);

  useEffect(() => {
    if (selectedRideId) {
      socket.emit("join_room", { roomId: selectedRideId });
    }
  }, [selectedRideId]);

  useEffect(() => {
    socket.emit("test_message", { hello: "from frontend" });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, createdAt: new Date() }]);
    });
    return () => socket.off("receive_message");
  }, []);

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

  const handleSendMessage = () => {
    if (!text.trim() || !selectedRideId || !user) return;
    shouldAutoScrollRef.current = true;

    socket.emit("send_message", {
      roomId: selectedRideId,
      message: text,
      sender: user,
    });
    setText("");
  };

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      shouldAutoScrollRef.current = false;
    }
  }, [messages]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black text-lime-400 flex flex-col">
      <Navbar />
      <div className="bg-gray-800/80 rounded-2xl p-4 m-6 shadow-xl backdrop-blur-sm flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-lime-500/20 p-3 flex flex-col">
          <h2 className="text-3xl font-bold mb-4">💬 Chats</h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedRideId(chat._id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRideId === chat._id
                      ? "bg-lime-600 text-black"
                      : "bg-gray-700 hover:bg-lime-500 hover:text-black"
                  }`}
                >
                  {chat.ride ? (
                    <>
                      <h3 className="font-semibold">
                        {chat.ride.from} ➡ {chat.ride.to}
                      </h3>
                      <p className="text-xs opacity-70">
                        {new Date(chat.ride.rideDate).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm italic opacity-70">
                      Ride info unavailable
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No chats yet!</p>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-lime-500/20">
            <h3 className="text-xl font-semibold">
              {selectedRideId
                ? "🚗 Chat with your ride buddies"
                : "Select a ride to start chatting"}
            </h3>
          </div>

          {/* Messages (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 custom-scrollbar">
            {selectedRideId ? (
              messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isOwn = msg.sender?._id === user?._id;
                  return (
                    <div
                      key={idx}
                      className={`max-w-[70%] p-3 rounded-2xl shadow ${
                        isOwn
                          ? "ml-auto bg-lime-500 text-black rounded-br-none"
                          : "mr-auto bg-gray-700 text-white rounded-bl-none"
                      }`}
                      title={new Date(msg.createdAt).toLocaleString()}
                    >
                      {!isOwn && (
                        <p className="font-bold mb-1 text-lime-300">
                          {msg.sender?.name || "Anonymous"}
                        </p>
                      )}
                      <p>{msg.message}</p>
                      <p className="text-[0.7rem] mt-1 opacity-60 text-right">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No messages yet.</p>
              )
            ) : (
              <p className="text-xl text-gray-400">
                Select a ride to view messages
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Fixed Input Bar */}
          {selectedRideId && (
            <div className="p-4 border-t border-lime-500/20 flex items-center gap-3 bg-gray-800">
              <input
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-full border border-lime-500 bg-black/80 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="bg-lime-500 hover:bg-lime-400 text-black px-5 py-2 rounded-full transition-all duration-200"
                onClick={handleSendMessage}
              >
                ➤
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

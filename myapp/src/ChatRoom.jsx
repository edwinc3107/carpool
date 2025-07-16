import Navbar from "./Navbar";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
import socket from "./socket";

function ChatRoom() {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Join room when ride is selected
  useEffect(() => {
    if (selectedRideId) {
      socket.emit("join_room", { roomId: selectedRideId });
    }
  }, [selectedRideId]);

  // Emit test message on initial load (optional debug)
  useEffect(() => {
    socket.emit("test_message", { hello: "from frontend" });
  }, []);

  // Listen for incoming real-time messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // Fetch past messages for selected ride
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

  // Fetch list of chats
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

  // Send message function
  const handleSendMessage = () => {
    if (!text.trim() || !selectedRideId || !user) return;

    socket.emit("send_message", {
      roomId: selectedRideId,
      message: text,
      sender: user, // ideally just user._id
    });

    setText("");
  };

  return (
    <div className="w-full h-full bg-black from-gray-900 to-gray-700 text-lime-400">
      <Navbar />
      <div className="bg-gray-700 rounded-2xl p-10 m-10">
        <div className="grid grid-cols-12">
          {/* Sidebar: List of chats */}
          <div className="col-span-4 p-3">
            <h2 className="text-5xl font-bold m-4">Chats</h2>
            <div className="h-100 overflow-y-auto space-y-2 pr-2">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedRideId(chat._id)}
                    className={`p-4 rounded cursor-pointer hover:bg-lime-600 ${
                      selectedRideId === chat._id ? "bg-lime-700" : "bg-gray-800"
                    }`}
                  >
                    <h3 className="font-semibold">{chat.ride.from} ➡ {chat.ride.to}</h3>
                    <p className="text-sm text-gray-300">
                      {new Date(chat.ride.rideDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No chats yet!</p>
              )}
            </div>
          </div>

          {/* Main Chat Window */}
          <div className="col-span-8 flex flex-col">
            <h3 className="text-4xl mb-4">
              Connect - with <br /> your fellow travellers!
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] p-2">
              {selectedRideId ? (
                messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div key={idx} className="bg-gray-800 p-3 rounded-lg shadow">
                      <p className="font-bold">{msg.sender?.name || "Anonymous"}:</p>
                      <p>{msg.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No messages yet.</p>
                )
              ) : (
                <p className="text-xl">Select a ride to view messages</p>
              )}
            </div>

            {/* Input + Send Button */}
            {selectedRideId && (
              <div className="mt-4 flex items-center gap-4">
                <input
                  placeholder="Enter message"
                  className="flex-1 p-2 rounded border border-white text-black"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  className="bg-lime-500 text-black p-2 rounded"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

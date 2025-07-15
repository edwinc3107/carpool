import Navbar from "./Navbar";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { useEffect, useState } from "react";

function ChatRoom() {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages= async () => {
      if (!selectedRideId) return;
        const res = await axios.get(`/mychats/${selectedRideId}`);
        setMessages(res.data.messages); 
    };
    if (user) fetchMessages();
  }, [selectedRideId]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/mychats');
        console.log("/mychats response:", res.data);
        setChats(res.data.chatRooms); 
        console.log("ChatRooms response:", res.data.chatRooms); 
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    if (user) fetchChats();
  }, [user]);

  return (
    <div className="w-full h-full bg-black from-gray-900 to-gray-700 text-lime-400">
      <Navbar />
      <div className="bg-gray-700 rounded-2xl p-10 m-10">
        <div className="grid grid-cols-12">
          <div className="col-span-4 p-3">
            <h2 className="text-5xl font-bold m-4">Chats</h2>
            <div className="h-100 overflow-y-auto space-y-2 pr-2">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedRideId(chat._id)}
                    className={`p-4 rounded cursor-pointer hover:bg-lime-600 ${
                      selectedRideId === chat.ride._id ? "bg-lime-700" : "bg-gray-800"
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
          <div className="col-span-8">
  <h3 className="text-4xl p-30">
    Connect - with <br /> your fellow travellers!
  </h3>
  <div className="p-4">
    {selectedRideId ? (
      <>
        <p className="text-xl font-bold mb-4">Messages for Ride: {selectedRideId}</p>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg._id} className="bg-gray-800 p-3 rounded-lg shadow">
                <p className="font-bold">{msg.sender?.name || "Anonymous"}:</p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet.</p>
          )}
        </div>
      </>
    ) : (
      <p className="text-xl">Select a ride to view messages</p>
    )}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

function MyRides({ typeOfRide }) {
  const { user } = useContext(UserContext);
  const [hostingRides, setHostingRides] = useState([]);
  const [hoppingRides, setHoppingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get("/myrides");
        const allRides = res.data.rides;
        const myId = user?._id?.toString();

        const hosting = allRides.filter(
          ride => ride.user?._id?.toString() === myId
        );
        const hopping = allRides.filter(
          ride => ride.passengers.some(p => p._id?.toString() === myId)
        );

        setHostingRides(hosting);
        setHoppingRides(hopping);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your rides.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRides();
  }, [user]);

  async function createChatRoom(rideId) {
    try {
      const response = await axios.post('/chat/create', { rideId });

      if (response.data?.error) {
        toast.error(response.data.error, {
          style: {
            border: "1px solid #84cc16",
            padding: "16px",
            color: "#A3E635",
            background: "#1f2937",
          },
          iconTheme: { primary: "#84cc16", secondary: "#F7FEE7" },
        });
      } else {
        toast.success("Chat room created!", {
          style: {
            border: "1px solid #84cc16",
            padding: "16px",
            color: "#A3E635",
            background: "#1f2937",
          },
          iconTheme: { primary: "#84cc16", secondary: "#F7FEE7" },
        });
        navigate(`/chat/${rideId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not create chat. Try again later.");
    }
  }

  if (loading) return (
    <p className="font-semibold text-5xl flex justify-center font-sans text-lime-400 mt-40">
      Loading your rides...
    </p>
  );

  if (error) return (
    <p className="text-red-500 text-center mt-10">{error}</p>
  );

  const renderRideCard = (ride, hosting = false) => (
    <div key={ride._id} className="bg-white/10 text-white p-6 mb-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <p className="text-lg"><strong>From:</strong> {ride.from}</p>
      <p className="text-lg"><strong>To:</strong> {ride.to}</p>
      <p className="text-lg"><strong>Date:</strong> {new Date(ride.rideDate).toLocaleDateString()}</p>
      {hosting && <p className="text-lg"><strong>Open Seats:</strong> {ride.openseats}</p>}
      {hosting && <p className="text-lg"><strong>Passengers:</strong> {ride.passengers.map(p => p.name).join(', ') || 'None yet'}</p>}
      {!hosting && <p className="text-lg"><strong>Host:</strong> {ride.user?.name || 'Unknown'}</p>}

      <div className="mt-4">
        {ride.chatCreated ? (
          <button
            onClick={() => navigate(`/chat/${ride._id}`)}
            className="bg-lime-500 hover:bg-lime-600 transition-all duration-300 px-5 py-2 rounded-xl font-semibold"
          >
            {hosting ? "Go to Chat Room" : "Join Chat Room"}
          </button>
        ) : (
          hosting ? (
            <button
              onClick={() => createChatRoom(ride._id)}
              className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-5 py-2 rounded-xl font-semibold"
            >
              Create Chat Room
            </button>
          ) : (
            <p className="text-yellow-300 font-semibold">Waiting for host to create chat...</p>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="text-white min-h-screen px-10">
      <h1 className="py-20 font-bold text-5xl flex justify-center font-sans text-lime-400">
        My Rides
      </h1>

      {typeOfRide === "Ride" ? (
        <div className="m-6 bg-black rounded-2xl p-6 shadow-inner">
          <h2 className="text-3xl font-semibold text-lime-400 mb-6">Rides you're joining</h2>
          {hoppingRides.length === 0 ? (
            <p className="text-gray-300">You haven't joined any rides yet.</p>
          ) : (
            hoppingRides.map(ride => renderRideCard(ride, false))
          )}
        </div>
      ) : (
        <div className="m-6 bg-black rounded-2xl p-6 shadow-inner">
          <h2 className="text-3xl font-semibold text-lime-400 mb-6">Rides you're hosting</h2>
          {hostingRides.length === 0 ? (
            <p className="text-gray-300">You haven't hosted any rides yet.</p>
          ) : (
            hostingRides.map(ride => renderRideCard(ride, true))
          )}
        </div>
      )}
    </div>
  );
}

export default MyRides;

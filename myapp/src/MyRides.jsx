import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";


function MyRides({typeOfRide}) {
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

      const hosting = allRides.filter(ride => ride.user?._id?.toString() === myId);
      const hopping = allRides.filter(ride =>
        ride.passengers.some(p => p._id?.toString() === myId)
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


  if (loading) return <p className="font-semibold text-5xl flex justify-center font-sans text-lime-400">Loading your rides...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="text-white">
      <h1 className="py-20 font-semibold text-5xl flex justify-center font-sans text-lime-400">
        My Rides
      </h1>

      {
        typeOfRide === "Ride"?(
      <div className="m-10 bg-black rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-lime-400 mb-6">Rides you're hopping:</h2>
        {hoppingRides.length === 0 ? (
          <p>You haven't joined any rides yet.</p>
        ) : (
          hoppingRides.map(ride => (
            <div key={ride._id} className="bg-white/10 text-white p-4 mb-4 rounded-xl shadow-md">
              <p><strong>From:</strong> {ride.from}</p>
              <p><strong>To:</strong> {ride.to}</p>
              <p><strong>Date:</strong> {new Date(ride.rideDate).toLocaleDateString()}</p>
              <p><strong>Host:</strong> {ride.user?.name || 'Unknown'}</p>
              {ride.chatCreated ? (
                    <button
                        onClick={() => navigate(`/chat/${ride._id}`)}
                        className="bg-lime-500 mt-4 px-4 py-2 rounded text-white"
                    >
                        Join Chat Room
                    </button>
                    ) : (
                    <p className="mt-4 text-yellow-300">Waiting for host to create chat room...</p>
                    )}
            </div>
          ))
        )}
      </div>) : (
      <div className="m-10 bg-black rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-lime-400 mb-6">Rides you're hosting:</h2>
        {hostingRides.length === 0 ? (
          <p>You haven't hosted any rides yet.</p>
        ) : (
          hostingRides.map(ride => (
            <div key={ride._id} className="bg-white/10 text-white p-4 mb-4 rounded-xl shadow-md">
              <p><strong>From:</strong> {ride.from}</p>
              <p><strong>To:</strong> {ride.to}</p>
              <p><strong>Date:</strong> {new Date(ride.rideDate).toLocaleDateString()}</p>
              <p><strong>Open Seats:</strong> {ride.openseats}</p>
              <p><strong>Passengers:</strong> {ride.passengers.map(p => p.name).join(', ') || 'None yet'}</p>
              {ride.chatCreated ? (
                    <button
                        onClick={() => navigate(`/chat/${ride._id}`)}
                        className="bg-lime-500 mt-4 px-4 py-2 rounded text-white"
                    >
                        Go to Chat Room
                    </button>
                    ) : (
                    <button
                        onClick={() => createChatRoom(ride._id)}
                        className="bg-blue-500 mt-4 px-4 py-2 rounded text-white"
                    >
                        Create Chat Room
                    </button>
                    )}

            </div>
          ))
        )}
      </div> )}
    </div>
  );
}

export default MyRides;

import axios from "axios";
import { useState, useEffect } from "react";
function MyRides(){

    const[myRides, setMyRides]=useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyRides = async () => {
        try {
            const response = await axios.post("/findmyride"); 
            setMyRides(response.data.rides);
        } catch (err) {
            setError("Failed to fetch your hosted rides.");
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchMyRides();
    }, []);

    if (loading) return <p className="font-semibold text-5xl flex justify-center font-sans text-lime-400">Loading your rides...</p>;
    if (error) return <p>{error}</p>;

    return(
        <div>
            <h1 className=" py-30 font-semibold text-5xl flex justify-center font-sans text-lime-400">My Rides</h1>
            <div className="m-10 bg-black">
                <h2 className=" p-20 font-semibold text-2xl flex font-sans text-lime-400">Rides you're hopping:</h2>
                    {myRides.length === 0 ? (
                        <p>You haven't hosted any rides yet.</p>
                    ) : (
                        myRides.map((ride) => (
                        <div
                            key={ride._id}
                            className="bg-white/10 text-white p-4 mb-4 rounded-xl shadow-md"
                        >
                            <p>
                            <strong>From:</strong> {ride.from}
                            </p>
                            <p>
                            <strong>To:</strong> {ride.to}
                            </p>
                            <p>
                            <strong>Date:</strong>{" "}
                            {new Date(ride.rideDate).toLocaleDateString()}
                            </p>
                            <p>
                            <strong>Open Seats:</strong> {ride.openseats}
                            </p>
                        </div>
                        ))
      )}
            </div>
            <div className="m-10 bg-black">
                <h2 className="p-20 font-semibold text-2xl flex font-sans text-lime-400">Rides you're hosting:</h2>

            </div>
            <div>
            </div>
        </div>
    )

}

export default MyRides;
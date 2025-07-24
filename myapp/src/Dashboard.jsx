import { UserContext } from "./context/UserContext";
import { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Card from './assets/Card';
import FindRide from "./FindRide";
import HostRide from "./HostRide";
import { toast } from 'react-hot-toast';
import axios from "axios";
import Widget from "./assets/Widget";
import Map from "./Map";
import HostCard from "./assets/HostCard";
import RidePopUp from "./assets/RidePopUp";

function Dashboard(){
    const { user } = useContext(UserContext);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [hosted, setHosted] = useState([])
    const [selectedRide, setSelectedRide] = useState(null);



    const widgets =[
      {
        title: "Fuel",
        value: '--',
      },
            {
        title: "Distance travelled",
        value: '--',
      },
            {
        title: "CO2 emissions",
        value: '--',  },
    ];


    useEffect(() => {
        console.log("User context in Dashboard:", user);
    }, [user]);

    useEffect(() => {
      axios.get('/findmyrequest')
        .then(res => {
          if (res.data.pendingRequests.length === 0) {
            console.log("No pending requests");
          } else {
            setPendingRequests(res.data.pendingRequests);
          }
        })
        .catch(err => {
          console.error("Failed to fetch ride requests:", err);
        });
    }, []);

    useEffect(() => {
      axios.get('/mydashboardrides')
        .then(res => {
          if (res.data.ridesHosting === 0) {
            console.log("No host");
          }else{
            //declare a state variable and lplug in value there??
          }
          if (res.data.ridesRequested  === 0) {
            console.log("No requests sent");
          }
          if (res.data.ridesPassenger  === 0) {
            console.log("No join-requests sent");
          }

        })
        .catch(err => {
          console.error("Failed to fetch ride requests:", err);
        });
    }, []);
    const handleRequest = async (rideId, userId, action) => {
        try {
          const endpoint = action === 'approve' ? '/approve-request' : '/deny-request';
          const res = await axios.put(endpoint, { rideId, userId });

          // Refresh request list after action
          setPendingRequests(prevRequests => {
          const updatedRequests = prevRequests
                .map(ride => {
                  if (ride.rideId !== rideId) return ride;

                  const remainingRequests = ride.requests.filter(r => r.id !== userId);
                  console.log(`Updating ride ${ride.rideId}, remaining:`, remainingRequests);

                  return { ...ride, requests: remainingRequests };
                })
                .filter(ride => ride.requests.length > 0);

              return updatedRequests;
            });

          toast.success(`${action === 'approve' ? "Approved" : "Denied"}`, {
          style: {
            border: "1px solid #84cc16",
            padding: "16px",
            color: "#A3E635",
            background: "#1f2937",
          },
          iconTheme: {
            primary: "#84cc16",
            secondary: "#F7FEE7",
          },
        });
        } catch (err) {
          toast.error(`Unable to ${action === 'approve' ? "approve!" : "deny!"}`, {
          style: {
            border: "1px solid #84cc16",
            padding: "16px",
            color: "#A3E635",
            background: "#1f2937",
          },
          iconTheme: {
            primary: "#84cc16",
            secondary: "#F7FEE7",
          },
        });
        }
      };

useEffect(() => {
  axios.get('/myhostedrides')
    .then(res => {
      if (res.data && res.data.rides && res.data.rides.length > 0) {
        let fetchedRides = res.data.rides;

        const sortedRides = [...fetchedRides].sort((a, b) => {
          const dateA = new Date(a.rideDate);
          const dateB = new Date(b.rideDate);
          return dateA.getTime() - dateB.getTime(); // Compares timestamps
        });

        const now = new Date();
        const fortyEightHoursLater = new Date(now.getTime() + (48 * 60 * 60 * 1000)); // Current time + 48 hours in milliseconds

        const upcomingHostedRides = sortedRides.filter(ride => {
          const rideDateTime = new Date(ride.rideDate);
          // Check if the ride date is in the future AND within the next 48 hours
          return rideDateTime >= now && rideDateTime <= fortyEightHoursLater;
        });
        setHosted(upcomingHostedRides); // Update state with the processed rides
        console.log("Upcoming Hosted rides (next 48h):", upcomingHostedRides);
      } else {
        console.log("No hosted rides found.");
        setHosted([]); //set as empty
      }
    })
    .catch(err => {
      console.error("Failed to fetch hosted rides:", err);
      toast.error("Failed to fetch your hosted rides.");
    });
}, []);


    return(
        <>
        <Navbar></Navbar>

        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="pt-28 px-20">
        <h1 className="text-3xl font-semibold">
           {user ? `${user.name}'s Dashboard` : "Loading your portal..."}
        </h1></div>
          <div className="flex justify-center gap-10 m-20 p-30">
         {widgets.map((widget, index) => (
                <Widget key={index} title={widget.title} value={widget.value} logo={widget.logo} />
            ))}
        </div>
                   
            <div className="flex flex-wrap gap-10 justify-center py-10">
              {pendingRequests.map((p, index) => (
                <Card key={index} Title={"Request"} feature={
                  <div>
                    <p>{p.requests?.[0]?.name || "Someone"} wants to join you!</p>
                    <p>From: {p.from}</p>
                    <p>To: {p.to}</p>
                    <p>On: {new Date(p.rideDate).toLocaleDateString()}</p>
                      <div className="flex gap-4 mt-4">
                      <button
                        className="bg-green-600 px-3 py-1 rounded"
                        onClick={() => handleRequest(p.rideId, p.requests[0].id, 'approve')}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 px-3 py-1 rounded"
                        onClick={() => handleRequest(p.rideId, p.requests[0].id, 'deny')}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                } />
              ))}
                {pendingRequests.length === 0 && (
                  <div className="text-white text-xl font-semibold">No ride requests!</div>
                )}
            </div>
            <div>
                <h1>Upcoming rides:</h1>
                <div className="flex flex-wrap gap-10 justify-center">
                {hosted.length > 0 ? (
                hosted.map((host, index) => (
                <HostCard
                  key={index}
                  fromCoords={host.fromCoords}
                  toCoords={host.toCoords}
                  Title={host.user?.name || "Unknown Host"} 
                  passenger={host.passengers}
                  feature={
                    <div className="flex-col overflow-y-auto">
                      {console.log(host)}
                      <p className="text-black">
                        Destination: <span className="font-medium">{host.to}</span>
                      </p>
                      <p className="text-black">
                        Date: <span className="font-medium">{new Date(host.rideDate).toLocaleDateString()}</span>
                      </p>
                      {host.passengers?.length > 0 ? (
                          <p className="text-black">
                            Passengers:{" "}
                            <span className="font-medium">
                              {host.passengers.map(p => p.name).join(", ")}
                            </span>
                          </p>
                        ) : (
                          <p className="text-black">No passengers yet.</p>
                        )}
                      <div className="bg-red">
                        <Map
                          fromCoords={host.fromCoords}
                          toCoords={host.toCoords}
                          intermediateStops={host.intermediateStops}
                        />
                      </div>
                    </div>
                  }
                />

                ))
              ) : (
                <div className="text-gray-300 text-xl font-semibold">No hosted rides yet!</div>
              )}
                </div>

            </div>

            <div className= "pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
            <div>
            Our Mission : to make long-distance travel more efficient, affordable, and human. 
            </div>
        </div>
        <div className="text-2xl font-semibold m-40">
         Whether you're commuting home, heading to a new city, or just passing through — our platform connects drivers and riders heading in the same direction. With intelligent route matching, shared costs, and real-time ride management, we’re building a community where every mile traveled means more saved — in money, fuel, and carbon. Join the movement toward smarter, sustainable travel.
        </div>
        </div>
        <div>
        </div>
        </>
    );
}

export default Dashboard;

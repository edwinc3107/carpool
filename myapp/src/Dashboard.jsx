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
    const [showDropdown, setShowDropdown] = useState(false);




    const widgets =[
      {
        title: "Fuel",
        value: '--',
        logo:(<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" id="flame">
  <g id="Octicons" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
    <g id="flame" fill="#000">
      <path id="Shape" d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"></path>
    </g>
  </g>
</svg>
),
      },
            {
        title: "Distance travelled",
        value: '--',
        logo:(<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" id="Distance">
  <path fill="#000000" fill-rule="evenodd" d="M20.3698 10.3405C21.5279 8.80916 23 6.50179 23 4.66667C23 2.64162 21.2091 1 19 1C16.7909 1 15 2.64162 15 4.66667C15 6.50179 16.4721 8.80916 17.6302 10.3405C18.3317 11.268 19.6683 11.268 20.3698 10.3405ZM19 6C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L11.2071 14.2071C10.8166 14.5976 10.1834 14.5976 9.79289 14.2071C9.40237 13.8166 9.40237 13.1834 9.79289 12.7929L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289ZM9 16.6667C9 18.5018 7.52794 20.8092 6.36985 22.3405C5.66835 23.268 4.33165 23.268 3.63015 22.3405C2.47206 20.8092 1 18.5018 1 16.6667C1 14.6416 2.79086 13 5 13C7.20914 13 9 14.6416 9 16.6667ZM6 17C6 17.5523 5.55228 18 5 18C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16C5.55228 16 6 16.4477 6 17Z" clip-rule="evenodd" class="color443c67 svgShape"></path>
</svg>
)
      },
            {
        title: "CO2 emissions",
        value: '--', 
      logo:(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="leaf">
  <path d="M12 19c-6.7 0-8-2.6-8-7C4 5.5 11.1.4 11.4.2c.3-.2.8-.2 1.2 0C12.9.4 20 5.5 20 12c0 1.7 0 7-8 7zm0-16.7C10.4 3.5 6 7.5 6 12c0 3.6.5 5 6 5s6-2.6 6-5c0-4.5-4.4-8.5-6-9.7z"></path>
  <path d="M14 24c-.3 0-.6-.2-.8-.4-3.6-5.5-2.6-13-2.3-15.8.1-.4.1-.7.1-.8 0-.5.5-1 1-1s1 .4 1 1c0 .2 0 .5-.1 1-.4 2.6-1.3 9.6 1.9 14.4.3.5.2 1.1-.3 1.4-.1.1-.3.2-.5.2z"></path>
</svg>
) },
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

        <div className="w-full h-full bg-black text-white">
        <div className="pt-15 px-20 flex justify-between">
        <h1 className="text-3xl font-semibold">
           {user ? `${user.name}'s Dashboard` : "Loading your portal..."}
        </h1>
        <div className="relative ml-90 pl-100">
  <button
    className="relative text-white rounded-full bg-gradient-to-br from-lime-500 to-green-500 p-3"
    onClick={() => setShowDropdown(prev => !prev)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path fill="white" d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></path>
    </svg>
    {pendingRequests.length > 0 && (
      <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
    )}
  </button>
    {showDropdown && (
    <div className="absolute right-0 mt-2 w-96 bg-white text-black rounded shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-4 font-semibold border-b">Pending Requests</div>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((p, index) => (
          <div key={index} className="px-4 py-3 border-b">
            <p className="font-medium">{p.requests?.[0]?.name || "Someone"} wants to join!</p>
            <p className="text-sm">From: {p.from}</p>
            <p className="text-sm">To: {p.to}</p>
            <p className="text-sm">On: {new Date(p.rideDate).toLocaleDateString()}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="text-white bg-green-600 px-2 py-1 rounded text-sm"
                onClick={() => handleRequest(p.rideId, p.requests[0].id, 'approve')}
              >
                Approve
              </button>
              <button
                className="text-white bg-red-600 px-2 py-1 rounded text-sm"
                onClick={() => handleRequest(p.rideId, p.requests[0].id, 'deny')}
              >
                Deny
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500">No new requests</div>
      )}
    </div>
  )}
</div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pt-20 pb-30 m-30">
  <div className="group relative bg-black rounded-2xl p-6 shadow-[0_0_40px_rgba(163,230,53,0.1)] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-lime-400/30 via-lime-500/20 to-lime-400/30 opacity-10 blur-xl group-hover:opacity-20 rounded-2xl transition-opacity duration-300" />
    <div className="absolute inset-0 m-[1px] rounded-[inherit] bg-neutral-950 z-0" />

    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-lime-400 to-lime-500 shadow-lg">
          <svg
            className="h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white tracking-wide">Analytics</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl bg-neutral-900 p-4 border border-lime-500/20 shadow-inner">
          <p className="text-sm text-gray-400">Fuel Saved</p>
          <p className="text-2xl font-bold text-white">24.5K</p>
          <p className="text-sm text-lime-400 font-semibold">+12.3%</p>
        </div>
        <div className="rounded-xl bg-neutral-900 p-4 border border-lime-500/20 shadow-inner">
          <p className="text-sm text-gray-400">Distance Shared</p>
          <p className="text-2xl font-bold text-white">1.2K</p>
          <p className="text-sm text-lime-400 font-semibold">+8.1%</p>
        </div>
        <div className="rounded-xl bg-neutral-900 p-4 border border-lime-500/20 shadow-inner">
          <p className="text-sm text-gray-400">CO₂ Saved</p>
          <p className="text-2xl font-bold text-white">24.5K</p>
          <p className="text-sm text-lime-400 font-semibold">+12.3%</p>
        </div>
      </div>
    </div>
  </div>
</div>


            <div className="m-20 pb-80">
              <div className="pl-20 text-lime-400 m-20 p-10 text-5xl flex gap-10"><h1><b>Upcoming rides:</b></h1>
              </div>
                
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
                <div className="text-gray-300 text-xl font-semibold flex gap-2">No hosted rides yet 
                <svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
                animate="pulse"
              >
                <path
                  fill="none"
                  stroke="#ffffff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 12h6l-6 8h6m4-16h6l-6 8h6"
                />
              </svg>
             </div>
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

import { useState, useRef,useEffect } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Navbar from "./Navbar";
import { MapPin, CalendarDays, User, Phone, Users } from 'lucide-react';
import MyRides from "./MyRides";
import Button from "./assets/Button";
import Card from "./assets/AvailableRide";

function FindRide(){
const [foundRides, setFoundRides] = useState([]);
const [clicked, setClicked] = useState({});
const [selectedRideForMap, setSelectedRideForMap] = useState(null);
const ridesPerPage = 9;
const totalPages = Math.ceil(foundRides.length/9);
const [page, setPage] = useState(0);
const paginatedRides = foundRides.slice(page * 9, (page + 1) * 9);
const rideGridRef = useRef(null);
const availableRidesRef = useRef(null);

const [data, setData]=useState({    
    from: "",
    to: "",
    date: "",
    openseats: 1,
    phone: "",
    message: "",
    preferences: {
      music: false,
      smoking: false,
      pets: false,
    },
  });

useEffect(() => {
  if (rideGridRef.current) {
    rideGridRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [page]);

useEffect(() => {
  if (foundRides.length > 0) {
    availableRidesRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [foundRides]);

  function handleChange(e){
    const { name, value, type, checked } = e.target

    if (name.includes("preferences.")) {
        const key = name.split('.')[1] //this gives us 'music' from preferences.music, 
          setData((prev) => ({
                ...prev,  //uses the present state of form
                preferences: { 
                ...prev.preferences, //uses the present state of preferences in form
                [key]: checked,
                },
            }));
    }
    else{
            setData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
    }
    }

    async function onSubmit(e){
    e.preventDefault();
    const rideinfo = data

    try {
      const response = await axios.post("/findride", rideinfo);

      if (response.data?.error) {
        toast.error(response.data.error, {
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
      } else {
        toast.success("Rides found!", {
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

        setFoundRides(response.data.rides);

        setData({    
                from: "",
                to: "",
                date: "",
                openseats: 1,
                phone: "",
                message: "",
                preferences: {
                music: false,
                smoking: false,
                pets: false,
                },
            })
      }
    } catch (err) {
      console.error("Hosting error:", err);
      toast.error("Could not host ride. Please try again later.");
    }
  }

  function RideMap({ ride }) {
  if (!ride) return null;

  // Defensive fallback if coords missing
  if (!ride.fromCoords || !ride.toCoords) {
    return <p className="text-red-500">Map data not available for this ride.</p>;
  }

  return (
    <div className="my-10 mx-20 rounded-xl shadow-md overflow-hidden">
      <MapRoute
        from={ride.fromCoords}
        to={ride.toCoords}
        stops={ride.intermediateStopsCoords || []}
      />
    </div>
      );
    }

  async function handleRequest(e, rideId, from, to) {
    e.preventDefault();
    try {

      const response = await axios.put('/request', { rideId });

      if (response.data?.error) {
        toast.error(response.data.error, {
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
      } else {
            setClicked(prev => ({
                ...prev,
                [rideId]: true
              }));
        toast.success("Request sent!", {
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
    } catch (err) {
      console.error("Request error:", err);
      toast.error("Could not request! Try again");
    }
  }

      return(
        <>
        <Navbar></Navbar>
        <div className="w-full h-full bg-black text-black">
        <div className=" pt-40 pl-175  pb-30 font-semibold text-6xl flex justify-center font-sans text-lime-400">
            So, where you off to?<br></br>Fill the form below & find your ride!
        </div>
        <div className="py-15 grid-rows-3 flex justify-between px-30 text-gray-300">
          <form onSubmit={onSubmit} className="w-full max-w-3xl mx-10 bg-white text-gray-900 backdrop-blur-md px-10 py-14 shadow-xl transition-all duration-300">
                <h2 className="text-3xl text-black mb-8 text-left">Find your Ride</h2>
                                  <div className="grid gap-6">
                                  {/* === Location & Date Fields === */}
                                  <div className="flex flex-col gap-6">
                                  {/** Start Location */}
                                  <div className="group">
                                    <label htmlFor="from" className="block mb-1 text-sm font-semibold text-[#05060f99] transition-colors duration-300 ease-[cubic-bezier(0.25,0.01,0.25,1)] group-focus-within:text-[#05060fc2]">
                                      Start Location
                                    </label>
                                    <input
                                      id="from"
                                      name="from"
                                      type="text"
                                      value={data.from}
                                      onChange={handleChange}
                                      placeholder="Where are you leaving from?"
                                      className="w-full h-11 max-w-full bg-[#05060f0a] rounded-md px-4 border-2 border-transparent text-base transition-colors duration-300 ease-[cubic-bezier(0.25,0.01,0.25,1)] focus:outline-none focus:border-[#05060f] group-hover:border-[#05060f]"
                                    />
                                  </div>

                                  {/** Stop Location */}
                                  <div className="group">
                                    <label htmlFor="to" className="block mb-1 text-sm font-semibold text-[#05060f99] transition-colors duration-300 ease-[cubic-bezier(0.25,0.01,0.25,1)] group-focus-within:text-[#05060fc2]">
                                      Stop Location
                                    </label>
                                    <input
                                      id="to"
                                      name="to"
                                      type="text"
                                      value={data.to}
                                      onChange={handleChange}
                                      placeholder="Where are you going?"
                                      className="w-full h-11 max-w-full bg-[#05060f0a] rounded-md px-4 border-2 border-transparent text-base transition-colors duration-300 ease-[cubic-bezier(0.25,0.01,0.25,1)] focus:outline-none focus:border-[#05060f] group-hover:border-[#05060f]"
                                    />
                                  </div>

                                  {/** Date of Travel */}
                                  <div className="group">
                                    <label htmlFor="date" className="block mb-1 text-sm font-semibold text-[#05060f99] transition-colors duration-300 ease-[cubic-bezier(0.25,0.01,0.25,1)] group-focus-within:text-[#05060fc2]">
                                      Date of Travel
                                    </label>
                                    <input
                                      id="date"
                                      name="date"
                                      type="date"
                                      value={data.date}
                                      onChange={handleChange}
                                      className="w-full h-11 max-w-full bg-[#05060f0a] rounded-md px-4 border-2 border-transparent text-base transition-colors duration-300 ease-[cubic-bezier(0.25,0.01,0.25,1)] focus:outline-none focus:border-[#05060f] group-hover:border-[#05060f]"
                                    />
                                  </div>
                                  </div>

                                  {/* === Preferences Section === */}
                                  <fieldset className="border border-white/30 rounded-xl p-5 mt-4">
                                  <legend className="text-sm uppercase font-semibold text-[#05060fc2] mb-4">Preferences</legend>
                                  <div className="flex flex-col gap-3">
                                    {[
                                      { label: "Music Allowed", name: "music" },
                                      { label: "Smoking Allowed", name: "smoking" },
                                      { label: "Pets Allowed", name: "pets" },
                                    ].map((pref) => (
                                      <label key={pref.name} className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          name={`preferences.${pref.name}`}
                                          checked={data.preferences[pref.name]}
                                          onChange={handleChange}
                                          className="accent-lime-500 w-5 h-5 mr-3"
                                        />
                                        {pref.label}
                                      </label>
                                    ))}
                                  </div>
                                  </fieldset>

                                  {/* === Submit Button === */}
                                  <div className="flex justify-center pt-6">
                                    <Button
                                  title={"Find"}></Button>
                                  </div>
                                  </div>

                                  </form>

        </div>
        <div>
            {paginatedRides.length > 0 && (
                <div ref={availableRidesRef}>
                <h2 className="pt-40 pr-175 pb-10 font-semibold text-6xl flex justify-center font-sans text-lime-400">
                  Available Rides
                </h2>
                <div ref={rideGridRef} className="mt-30 ml-30 text-white p-20 grid grid-cols-3">
                  {paginatedRides.map((ride) => (
                    <div key={ride._id} 
                    onClick={() => setSelectedRideForMap(ride)}
                    className="">
                      <div className="mb-20">
                      <Card from={ride.from} to={ride.to} date={new Date(ride.rideDate).toDateString().split(' ')[1]+ ' '+ new Date(ride.rideDate).toDateString().split(' ')[2]+ ', '+new Date(ride.rideDate).toDateString().split(' ')[3]} 
                      distance={ride.distance?.toFixed(1)} seats={ride.openseats} host={ride.user?.name || 'Unknown'}
                      button={
                          <div>
                          <button
                              disabled={clicked[ride._id]}
                              onClick={(e) => {
                                 e.stopPropagation(); 
                                handleRequest(e, ride._id, ride.from, ride.to);
                              }}
                              className={`m-10 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out
                                ${clicked[ride._id]
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-lime-500 hover:bg-lime-600 text-white hover:shadow-lg'}
                              `}
                            >
                              {clicked[ride._id] ? <p>Requested</p> : <p>Request to join</p>}
                            </button>
                          </div>
                      }
                      ></Card></div>
                      </div>
                  ))}
                </div> 
                  <div className="flex justify-center gap-4">
                      {page === 0 ? null : (
                        <button
                          className="bg-lime-500 flex justify-center gap-2 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-lime-400 hover:scale-105 transition duration-300"
                          onClick={() => setPage(page - 1)}
                        >
                                                <svg
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px"
                      >
                        <path
                          fill="none"
                          stroke="#ffffff"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m12 19l-7-7l7-7m7 7H5"
                        />
                      </svg>

                          Prev
                        </button>
                      )}
                      {page === totalPages-1 ? null : (
                        <button
                          className="bg-lime-500 flex justify-center gap-2 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-lime-400 hover:scale-105 transition duration-300"
                          onClick={() => setPage(page + 1)}
                        >
                          <svg
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24px"
  height="24px"
>
  <path
    fill="none"
    stroke="#ffffff"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M5 12h14m-7-7l7 7l-7 7"
  />
</svg>

                          Next
                        </button>
                      )}
                    </div>
                </div>
              )}
              
         </div>  
        <div className= "pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
            <div>
            Our Mission : to make long-distance travel more efficient, affordable, and human.
            </div>
        </div>
        <div className= "pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
            <div>
           <MyRides typeOfRide="Ride" />
            </div>
        </div>
        <div className="text-2xl font-semibold m-40">
         Whether you're commuting home, heading to a new city, or just passing through — our platform connects drivers and riders heading in the same direction. With intelligent route matching, shared costs, and real-time ride management, we’re building a community where every mile traveled means more saved — in money, fuel, and carbon. Join the movement toward smarter, sustainable travel.
        </div>
        </div>
        </>
    )
}
export default FindRide;
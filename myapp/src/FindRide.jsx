import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Navbar from "./Navbar";
import { MapPin, CalendarDays, User, Phone, Users } from 'lucide-react';

function FindRide(){
const [foundRides, setFoundRides] = useState([]);
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
  })

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

    return(
        <>
        <Navbar></Navbar>
        <div className="w-full h-full bg-black text-white">
        <div className=" pt-60  pb-30 font-semibold text-6xl flex justify-center font-sans text-lime-400">
            So, where you off to?<br></br>Fill the form below & find your ride!
        </div>
        <div className="py-15 grid-rows-3 flex justify-between px-30">
            <form onSubmit={onSubmit} className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl px-10 py-14 text-white shadow-xl transition-all duration-300">
                <h2 className="text-3xl font-bold text-lime-400 mb-8 text-center">Find a Ride</h2>
                <div className="grid gap-6">
                    <div className="flex justify-between">
                    <div>
                    <label className="block text-sm uppercase tracking-wide font-medium mb-2">Start Location</label>
                    <input
                        type="text"
                        name="from"
                        value={data.from}
                        onChange={handleChange}
                        placeholder="Where are you leaving from?"
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                    />
                    </div>

                    <div>
                    <label className="block text-sm uppercase tracking-wide font-medium mb-2">Stop Location</label>
                    <input
                        type="text"
                        name="to"
                        value={data.to}
                        onChange={handleChange}
                        placeholder="Where are you going?"
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                    />
                    </div>

                    <div>
                    <label className="block text-sm uppercase tracking-wide font-medium mb-2">Date of Travel</label>
                    <input
                        type="date"
                        name="date"
                        value={data.date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                    />
                    </div></div>
                    <fieldset className="border border-white/30 rounded-xl p-5">
                    <legend className="text-sm uppercase font-semibold text-white mb-4">Preferences</legend>
                    <div className="flex flex-col gap-3">
                        <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={data.preferences.music}
                            onChange={handleChange}
                            name="preferences.music"
                            className="accent-lime-400 w-5 h-5 mr-3"
                        />
                        Music Allowed
                        </label>
                        <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="preferences.smoking"
                            checked={data.preferences.smoking}
                            onChange={handleChange}
                            className="accent-lime-400 w-5 h-5 mr-3"
                        />
                        Smoking Allowed
                        </label>
                        <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="preferences.pets"
                            checked={data.preferences.pets}
                            onChange={handleChange}
                            className="accent-lime-400 w-5 h-5 mr-3"
                        />
                        Pets Allowed
                        </label>
                    </div>
                    </fieldset>

                    <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    >
                        FIND!
                    </button>
                    </div>
                </div>
                </form>

        </div>
        <div>
                        {foundRides.length > 0 && (
                <div className="mt-10 text-white">
                  <h2 className="text-2xl mb-4">Available Rides:</h2>
                  {foundRides.map((ride) => (
                    <div key={ride._id} className="bg-white/10 p-8 mb-4 rounded-xl shadow-md border border-white/20 hover:bg-white/20 transition">
                        {/* First Row: From and To */}
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="">
                            <strong> <MapPin size={16} />From:</strong> <br></br>
                            <p>{ride.from}</p>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} />
                            <strong>To:</strong> <br></br>{ride.to}
                          </div>
                        </div>

                        {/* Second Row: Date, Host, Seats */}
                        <div className="flex flex-col md:flex-row flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            <strong>Date:</strong> {new Date(ride.rideDate).toDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <strong>Host:</strong> {ride.user?.name || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <strong>Seats:</strong> {ride.openseats}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              )}
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
        </>
    )
}
export default FindRide;
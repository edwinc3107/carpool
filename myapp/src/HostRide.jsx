import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Navbar from "./Navbar";

function HostRide(){

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
      const response = await axios.post("/hostride", rideinfo);

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
        toast.success("Ride hosted!", {
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
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="pt-38 px-20">
        <h1 className="text-3xl font-semibold text-lime-400">
            Discover travellers on the same journey - connect, chat & commute. Together.
        </h1></div>
        <div className=" pt-60  pb-30 font-semibold text-6xl flex justify-center font-sans text-lime-400">
            So, where you off to?<br></br>Fill the form below & host your ride!
        </div>
        <div className="py-15 grid-rows-3 flex justify-between px-30">
        <form onSubmit={onSubmit} className="w-full h-full bg-white rounded px-20 py-20 text-gray-700"> 
            <div className="py-3">
                <label className="font-medium">Start Location</label>
                <input type="text" name="from" value={data.from} onChange={handleChange} placeholder="Where are you leaving from?" className="w-full m-2 px-2 border rounded-full py-3" />
            </div>
            <div className="py-3">
                <label className="font-medium">Stop Location:</label>
                <input type="text" value={data.to} name="to"   onChange={handleChange} placeholder="Where are you going?" className="w-full m-2 px-2 border rounded-full py-3" />
            </div>
            
            <div className="py-3">
                <label className="font-medium">Date of travel:</label>
                <input type="date" value={data.date} name="date"   onChange={handleChange} placeholder="When?" className="w-full m-2 px-2 border rounded-full py-3" />
            </div>

            <div className="py-3">
                <label className="font-medium">Seats available:</label>
                <input type="number" value={data.openseats} name="openseats" min="1" max="10"  onChange={handleChange} className="w-full m-2 px-2 border rounded-full py-3" />
            </div>
            
            <div className="py-3">
                <label className="block font-medium text-gray-700">Phone Number:</label>
                <input type="tel" value={data.phone} name="phone"  onChange={handleChange} placeholder="123-456-7890" className="w-full p-2 border rounded-full py-3" />
            </div>

            <div className="py-3">
                <label className="block font-medium text-gray-700">Message to Travel Buddies</label>
                <textarea name="message" value={data.message} rows="3" onChange={handleChange} placeholder="For example: Bring snacks, good vibes only!" className="w-full p-2 border rounded" />
            </div>

            <fieldset className="border rounded p-4 py-3">
                <legend className="font-medium text-gray-700 py-3">Preferences</legend>
                <label className="block">
                <input type="checkbox" checked={data.preferences.music} onChange={handleChange} name="preferences.music" className="mr-2" />
                Music Allowed
                </label>
                <label className="block">
                <input type="checkbox" name="preferences.smoking" checked={data.preferences.smoking} onChange={handleChange} className="mr-2" />
                Smoking Allowed
                </label>
                <label className="block">
                <input type="checkbox" name="preferences.pets" checked={data.preferences.pets} onChange={handleChange} className="mr-2 py-3" />
                Pets Allowed
                </label>
            </fieldset>
            <div className="flex justify-center">
            <button type="submit" className="bg-lime-500 text-white px-6 py-3 m-3 rounded hover:bg-lime-600">
                Submit Ride
            </button></div>
            </form>
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
export default HostRide;
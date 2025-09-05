import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Navbar from "./Navbar";
import MyRides from "./MyRides";
import Button from "./assets/Button";
import RouteMap from "./Map";

function HostRide() {
  const [data, setData] = useState({
    from: "",
    to: "",
    date: "",
    openseats: 1,
    phone: "",
    message: "",
    intermediateStops: [],
    preferences: {
      music: false,
      smoking: false,
      pets: false,
    },
  });

  const [rideDetails, setRideDetails] = useState(null);
  const [pageScroll, setPageScroll] = useState(false);
  const formRef = useRef(null);

  // Scroll to form when map is updated
  useEffect(() => {
    if (pageScroll && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pageScroll]);

  function handleChange(e) {
    setRideDetails(null); // reset map on change
    const { name, value, type, checked } = e.target;

    if (name.includes("preferences.")) {
      const key = name.split(".")[1];
      setData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: checked },
      }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/hostride", data);
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
        toast.success("Ride hosted successfully!", {
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
        setRideDetails(response.data.rideDetails);
        setData({
          from: "",
          to: "",
          date: "",
          openseats: 1,
          phone: "",
          message: "",
          intermediateStops: [],
          preferences: { music: false, smoking: false, pets: false },
        });
        setPageScroll(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not host ride. Try again later.", {
        style: {
          border: "1px solid #f87171",
          padding: "16px",
          color: "#f87171",
          background: "#1f2937",
        },
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-black text-white">

        {/* Header */}
        <div className="pt-40 pb-20 font-bold text-4xl flex justify-center text-center font-sans text-lime-400 px-10">
          Ready to host a ride?<br />
          <span className="pt-20 pb-20 font-bold text-6xl flex justify-center text-center font-sans text-lime-400 px-10">
            You are the host!
            </span>
        </div>

        {/* Hosting Form */}
        <div ref={formRef} className="py-15 flex justify-center px-10">
          <form 
            onSubmit={onSubmit} 
            className="w-full max-w-3xl bg-white text-gray-900 backdrop-blur-md px-10 py-14 shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            <h2 className="text-3xl text-black mb-8 text-left">Host Your Ride</h2>
            
            <div className="grid gap-6">
              {/* Start Location */}
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-gray-600 group-focus-within:text-gray-900 transition-colors duration-300">
                  Start Location
                </label>
                <input
                  type="text"
                  name="from"
                  value={data.from}
                  onChange={handleChange}
                  placeholder="Where are you leaving from?"
                  className="w-full h-11 px-4 rounded-md border-2 border-transparent bg-[#05060f0a] focus:border-lime-500 focus:ring-lime-300 transition-all duration-300 hover:border-lime-400"
                />
              </div>

              {/* Stop Location */}
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-gray-600 group-focus-within:text-gray-900 transition-colors duration-300">
                  Destination
                </label>
                <input
                  type="text"
                  name="to"
                  value={data.to}
                  onChange={handleChange}
                  placeholder="Where are you heading?"
                  className="w-full h-11 px-4 rounded-md border-2 border-transparent bg-[#05060f0a] focus:border-lime-500 focus:ring-lime-300 transition-all duration-300 hover:border-lime-400"
                />
              </div>

              {/* Date */}
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-gray-600 group-focus-within:text-gray-900 transition-colors duration-300">
                  Date of Travel
                </label>
                <input
                  type="date"
                  name="date"
                  value={data.date}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border-2 border-transparent bg-[#05060f0a] focus:border-lime-500 focus:ring-lime-300 transition-all duration-300 hover:border-lime-400"
                />
              </div>

              {/* Seats */}
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-gray-600 group-focus-within:text-gray-900 transition-colors duration-300">
                  Seats Available
                </label>
                <input
                  type="number"
                  name="openseats"
                  value={data.openseats}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border-2 border-transparent bg-[#05060f0a] focus:border-lime-500 focus:ring-lime-300 transition-all duration-300 hover:border-lime-400"
                />
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-gray-600 group-focus-within:text-gray-900 transition-colors duration-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="Where can riders reach you?"
                  className="w-full h-11 px-4 rounded-md border-2 border-transparent bg-[#05060f0a] focus:border-lime-500 focus:ring-lime-300 transition-all duration-300 hover:border-lime-400"
                />
              </div>

              {/* Message */}
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-gray-600 group-focus-within:text-gray-900 transition-colors duration-300">
                  Notes for Riders
                </label>
                <textarea
                  name="message"
                  value={data.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any information or instructions for your passengers..."
                  className="w-full px-4 py-3 rounded-md border-2 border-transparent bg-[#05060f0a] focus:border-lime-500 focus:ring-lime-300 resize-none transition-all duration-300 hover:border-lime-400"
                />
              </div>

              {/* Preferences */}
              <fieldset className="border border-white/30 rounded-xl p-5 mt-4">
                <legend className="text-sm uppercase font-semibold text-[#05060fc2] mb-4">Preferences</legend>
                <div className="flex flex-col gap-3">
                  {["music", "smoking", "pets"].map(pref => (
                    <label key={pref} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name={`preferences.${pref}`}
                        checked={data.preferences[pref]}
                        onChange={handleChange}
                        className="accent-lime-500 w-5 h-5 mr-3"
                      />
                      {pref.charAt(0).toUpperCase() + pref.slice(1)} Allowed
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Intermediate Stops */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-600">Intermediate Stops (Optional)</label>
                {data.intermediateStops.map((stop, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={stop.address}
                      placeholder={`Stop ${idx + 1}`}
                      onChange={(e) => {
                        const updated = [...data.intermediateStops];
                        updated[idx].address = e.target.value;
                        setData({ ...data, intermediateStops: updated });
                      }}
                      className="flex-1 px-4 py-2 bg-[#05060f0a] border border-white/30 rounded-xl transition-all duration-300 focus:border-lime-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.intermediateStops];
                        updated.splice(idx, 1);
                        setData({ ...data, intermediateStops: updated });
                      }}
                      className="text-red-500 font-bold text-lg transition-all duration-300 hover:text-red-400"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setData({ ...data, intermediateStops: [...data.intermediateStops, { address: "" }] })}
                  className="mt-2 text-lime-400 font-semibold hover:underline transition-all duration-300"
                >
                  + Add Stop
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button title="Host Ride" />
              </div>
            </div>
          </form>
        </div>

        {/* Route Map */}
        {rideDetails && (
          <div className="my-10 mx-20 rounded-xl shadow-md overflow-hidden">
            <RouteMap ride={rideDetails} />
          </div>
        )}

        {/* Mission */}
        <div className="pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400 text-center">
          Our Mission: Make long-distance travel more efficient, safe, and connected.
        </div>

        {/* My Hosted Rides */}
        <div className="pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
          <MyRides typeOfRide="Host" />
        </div>

        {/* Description */}
        <div className="text-2xl font-semibold m-40 text-center p-30">
          With our platform, you can share rides, connect with riders, and promote sustainable travel —
          all while keeping control of your ride details and preferences.
        </div>
      </div>
    </>
  );
}

export default HostRide;

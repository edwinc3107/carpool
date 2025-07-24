import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import Navbar from "./Navbar";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import MyRides from "./MyRides";
import RouteMap from "./Map";

function HostRide() {
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);

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

  const [rideDetails, setRideDetails] = useState(null); // NEW: store backend response to show map

  function handleChange(e) {
    setRideDetails(null); // reset map when editing

    const { name, value, type, checked } = e.target;

    if (name.includes("preferences.")) {
      const key = name.split(".")[1];
      setData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: checked,
        },
      }));
    } else {
      setData((prev) => ({
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
        toast.error(response.data.error);
      } else {
        toast.success("Ride hosted!");
        setData({
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
        setRideDetails(response.data.rideDetails); // NEW: set map data

      }
    } catch (err) {
      console.error("Hosting error:", err);
      toast.error("Could not host ride. Please try again later.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-full bg-black text-white">
        <div className="pt-60 pb-30 font-semibold text-6xl flex justify-center font-sans text-lime-400">
          So, where you off to? <br />
          Fill the form below & host your ride!
        </div>

        <div className="py-15 flex justify-between px-30">
          <form onSubmit={onSubmit} className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl px-10 py-14 text-white shadow-xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-lime-400 mb-8 text-center">Host a Ride</h2>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm uppercase font-medium mb-2">Start Location</label>
                <input
                  type="text"
                  name="from"
                  value={data.from}
                  onChange={handleChange}
                  placeholder="Where are you leaving from?"
                  className="w-full px-4 py-3 bg-black border border-white/30 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm uppercase font-medium mb-2">Stop Location</label>
                <input
                  type="text"
                  name="to"
                  value={data.to}
                  onChange={handleChange}
                  placeholder="Where are you going?"
                  className="w-full px-4 py-3 bg-black border border-white/30 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm uppercase font-medium mb-2">Date of Travel</label>
                <input
                  type="date"
                  name="date"
                  value={data.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/30 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm uppercase font-medium mb-2">Seats Available</label>
                <input
                  type="number"
                  name="openseats"
                  value={data.openseats}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/30 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm uppercase font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/30 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm uppercase font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows="3"
                  value={data.message}
                  onChange={handleChange}
                  placeholder="Leave a note for fellow passengers..."
                  className="w-full px-4 py-3 bg-black border border-white/30 rounded-xl resize-none"
                />
              </div>

              <fieldset className="border border-white/30 rounded-xl p-5">
                <legend className="text-sm uppercase font-semibold text-white mb-4">Preferences</legend>
                <div className="flex flex-col gap-3">
                  {["music", "smoking", "pets"].map((pref) => (
                    <label key={pref} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name={`preferences.${pref}`}
                        checked={data.preferences[pref]}
                        onChange={handleChange}
                        className="accent-lime-400 w-5 h-5 mr-3"
                      />
                      {pref.charAt(0).toUpperCase() + pref.slice(1)} Allowed
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="block text-sm uppercase font-medium mb-2">Intermediate Stops (Optional)</label>
                {(data.intermediateStops ?? []).map((stop, idx) => (
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
                      className="flex-1 px-4 py-2 bg-black border border-white/30 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.intermediateStops];
                        updated.splice(idx, 1);
                        setData({ ...data, intermediateStops: updated });
                      }}
                      className="text-red-500"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setData({ ...data, intermediateStops: [...data.intermediateStops, { address: "" }] })}
                  className="mt-2 text-lime-400 hover:underline"
                >
                  + Add Stop
                </button>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg"
                >
                  Submit Ride
                </button>
              </div>
            </div>
          </form>
        </div>

                {rideDetails && (
          <div className="mt-10">
            <RouteMap ride={rideDetails} />
          </div>
        )}

        <div className="pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
          <div>Our Mission: To make long-distance travel more efficient, affordable, and human.</div>
        </div>

        <div className="pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
          <MyRides typeOfRide="Host" />
        </div>

        <div className="text-2xl font-semibold m-40">
          Whether you're commuting home, heading to a new city, or just passing through — our platform connects
          drivers and riders heading in the same direction. With intelligent route matching, shared costs, and
          real-time ride management, we’re building a community where every mile traveled means more saved — in
          money, fuel, and carbon.
        </div>
      </div>
    </>
  );
}

export default HostRide;

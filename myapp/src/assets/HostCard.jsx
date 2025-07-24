import { UserContext } from "../context/UserContext";
import { useContext, useState} from "react";
import axios from "axios";

function HostCard({ onClick, title, fromCoords, toCoords, feature, passenger, link, rating }) {
   const [routeInfo, setRouteInfo] = useState(null);
  async function getRouteInfo(fromCoords, toCoords){
    try{

    const response = await axios.post('/ridecost', {
      fromCoords: { lat: fromCoords.lat, lng: fromCoords.lng },
      toCoords: { lat: toCoords.lat, lng: toCoords.lng}
    })

    if(!response){
      console.log("No response")
    }

    console.log(response.data)
    setRouteInfo(response.data)

  }catch(err){
    console.log({Error: {err}})
  }
  }

  return (
  <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
    <h2 className="text-lg font-semibold text-black mb-2">{title}</h2>

    <div className="flex-grow overflow-hidden h-100 w-100 mb-2">
      {typeof feature === "string" ? (
        <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
      ) : (
        <div className="text-sm text-gray-700 leading-relaxed">{feature}</div>
      )}
    </div>
    <div className="mt-2">
      <button onClick ={()=>{
        getRouteInfo(fromCoords, toCoords)
      }}
      className="bg-lime-500 text-white px-4 py-3 rounded">
        Costs + ETA
      </button>
    </div>
    {routeInfo && (
      <div className="mt-4 text-gray-800">
        <p>Distance: {routeInfo.distanceKm} km</p>
        <p>Duration: {routeInfo.durationMin} minutes</p>
        <p>ETA: {routeInfo.etaText}</p>
      </div>
    )}
  </div>
);
}
export default HostCard;
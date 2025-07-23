import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function HostCard({ title, feature, passenger, link, rating }) {

  return (
  <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
    <h2 className="text-lg font-semibold text-black mb-2">{title}</h2>

    <div className="flex-grow overflow-hidden mb-2">
      {typeof feature === "string" ? (
        <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
      ) : (
        <div className="text-sm text-gray-700 leading-relaxed">{feature}</div>
      )}
    </div>

    <div className="mt-4">
      <input
        placeholder="Enter pickup location"
        className="border p-2 rounded w-full mb-2"
      />
      <button className="bg-lime-500 text-white px-4 py-2 rounded w-full">
        Send
      </button>
    </div>
  </div>
);

}


export default HostCard;
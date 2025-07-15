import Popup from "./assets/Popup";
import { useState } from "react";

function Navbar() {
  const [pop, setPop] = useState(false);

  return (
    <div>
      <div className="top-0 w-full py-6 z-50 backdrop-blur-md flex justify-between px-10">
        <ul className="flex justify-center divide-x divide-gray-600">
          <li>
            <a
              href="/dashboard"
              className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/findride"
              className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
            >
              Find Ride
            </a>
          </li>
          <li>
            <a
              href="/hostride"
              className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
            >
              Host Ride
            </a>
          </li>
          <li>
            <a
              href="/chat"
              className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
            >
              Chats
            </a>
          </li>
        </ul>

        <button
          onClick={() => setPop(true)}
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
      {pop && <Popup onClose={() => setPop(false)} />}
    </div>
  );
}

export default Navbar;

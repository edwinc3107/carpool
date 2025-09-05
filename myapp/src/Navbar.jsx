import Popup from "./assets/Popup";
import { useState } from "react";

function Navbar() {
  const [pop, setPop] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: DashboardIcon },
    { href: "/findride", icon: FindRideIcon },
    { href: "/hostride", icon: HostRideIcon },
    { href: "/chat", icon: ChatIcon },
  ];

  return (
    <div className="mx-150">
      <div className="fixed w-70 py-1 z-50 bg-black rounded-full flex justify-between px-10 items-center">
        <ul className="flex gap-9">
          {navItems.map(({ href, icon: Icon }, idx) => (
            <li key={idx}>
              <a
                href={href}
                className="group text-white p-2 rounded transition duration-300 hover:text-lime-400"
              >
                <Icon className="w-6 h-6 transition-transform transform group-hover:-translate-y-1 group-hover:text-lime-400" />
              </a>
            </li>
          ))}
        </ul>
        </div>
        <div className="flex justify-center">
          <div className="my-4 ml-300">
        <button
          onClick={() => setPop(true)}
          className="bg-lime-500 text-black font-semibold py-2 px-6 rounded-full shadow-md hover:bg-lime-400 hover:scale-105 transition duration-300"
        >
          Logout
        </button></div>
      </div>
      {pop && <Popup onClose={() => setPop(false)} />}
    </div>
  );
}

function DashboardIcon(props) {
  return (
    <svg {...props} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
      <path
        fillRule="evenodd"
        d="M7.08.222a.6.6 0 0 1 .84 0l6.75 6.64a.6.6 0 0 1-.84.856L13 6.902V12.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5V6.902l-.83.816a.6.6 0 1 1-.84-.856zm.42 1.27L12 5.918V12h-2V8.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V12H3V5.918zM7 12h2V9H7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FindRideIcon(props) {
  return (
    <svg {...props} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="m11 16-1-2-7-3.5a.55.55 0 0 1 0-1L21 3l-2.916 8.076M15 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22" />
    </svg>
  );
}

function HostRideIcon(props) {
  return (
    <svg {...props} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <path d="M240 112h-10.8l-27.78-62.5A16 16 0 0 0 186.8 40H69.2a16 16 0 0 0-14.62 9.5L26.8 112H16a8 8 0 0 0 0 16h8v80a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-16h96v16a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-80h8a8 8 0 0 0 0-16M69.2 56h117.6l24.89 56H44.31ZM64 208H40v-16h24Zm128 0v-16h24v16Zm24-32H40v-48h176ZM56 152a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H64a8 8 0 0 1-8-8m112 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8" />
    </svg>
  );
}

function ChatIcon(props) {
  return (
    <svg {...props} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m0 14h-7.277L9 18.233V16H4V4h16z" />
      <path d="M7 7h10v2H7zm0 4h7v2H7z" />
    </svg>
  );
}

export default Navbar;
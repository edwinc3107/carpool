import React, { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import Form from "./assets/Form";
import Button from "./Button";
import { motion } from "framer-motion";
import axios from "axios";

function Profile() {
  const user = useContext(UserContext);

  return (
    <div
      className="w-screen h-screen bg-gradient-to-br to-gray-700 text-white flex justify-center items-center"
      style={{ fontFamily: "Orbitron" }}
    >
      <div className="text-center">
        <div className="flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="75"
            height="75"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"></path>
            <path d="M7 14h.01"></path>
            <path d="M17 14h.01"></path>
            <rect width="18" height="8" x="3" y="10" rx="2"></rect>
            <path d="M5 18v2"></path>
            <path d="M19 18v2"></path>
          </svg>
        </div>
        <h1 className="text-4xl">
          Welcome to the <span className="font-extrabold text-lime-400">future</span> <br />
          <motion.span
            className="text-white text-5xl font-extrabold drop-shadow-[0_2px_2px_rgba(0,255,0,0.5)]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {user.name}
          </motion.span>
        </h1>
        <h3>Let's get you rollin'</h3>
      </div>
    </div>
  );
}

export default Profile;

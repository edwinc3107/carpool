import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
function Landing() {
  const features = [
    "🚗 Your new favourite way to travel – save money, time & fuel",
    "👥 Share a ride with friends, neighbours – or even strangers going your way!",
    "⚡ Optimized routes, dynamic matching, and an easy way to link up",
    "🌿 Reduce your carbon footprint — make travel sustainable",
    "🚀 It's like UberPool, but smarter, cheaper, and built for students",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const navigate = useNavigate();
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center px-4"
         style={{ fontFamily: "Orbitron" }}>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-12">
        
        {/* LEFT */}
        <div className="text-center md:text-left md:w-1/2">
          <div className="flex justify-center md:justify-start items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"></path>
              <path d="M7 14h.01"></path>
              <path d="M17 14h.01"></path>
              <rect width="18" height="8" x="3" y="10" rx="2"></rect>
              <path d="M5 18v2"></path>
              <path d="M19 18v2"></path>
            </svg>
          </div>

          <h1 className="text-4xl leading-snug">
            Welcome to the <span className="font-extrabold text-lime-400">future</span> of <br />
            <motion.span
              className="text-white text-5xl font-extrabold drop-shadow-[0_2px_2px_rgba(0,255,0,0.5)]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Carpool
            </motion.span>
          </h1>

          <div className="flex justify-center md:justify-start gap-3 mt-6">
            <Button message={"I'm new here"} onClick={goToRegister}/>
            <Button message={"Login"} onClick={()=>{ navigate('/login')}}/>
          </div>
        </div>

        <motion.div
          className="bg-gradient-to-br from-gray-800 to-black text-white rounded-3xl px-10 py-12 shadow-2xl w-full md:max-w-2xl border border-lime-400 min-h-[250px] transition-all duration-700 ease-in-out"
        >
          <h2 className="text-xl font-semibold text-lime-400 mb-4 text-center">Why Carpool?</h2>

          <div className="min-h-[120px] text-lg leading-relaxed text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.6 }}
              >
                {features[index]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  i === index ? "bg-lime-400 scale-125" : "bg-gray-500"
                }`}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;

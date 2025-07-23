import React from "react";
import Card from './assets/Card';
import Brick from "./assets/Brick";

function Landing() {
  const features = [
    {
      title: "Smart Routes",
      feature: "Get matched with riders heading in your direction—even if they’re joining from in-between stops.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 5a3 3 0 1 0-5.997.125..." />
        </svg>
      )
    },
    {
      title: "Sustainability Board",
      feature: "See how much CO₂ you’ve saved and your impact on fuel usage with every shared ride.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M7 19H4.815..." />
        </svg>
      )
    },
    {
      title: "Flexible Ride Hosting",
      feature: "Host rides on your terms—set your stops, choose your passengers, and manage everything easily.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 19l-1.106..." />
        </svg>
      )
    },
    {
      title: "Ride Alerts",
      feature: "Instantly get notified when new riders join your trip or when matching rides pop up.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M7 18v-6a5 5..." />
        </svg>
      )
    },
    {
      title: "Route Planner",
      feature: "Visualize your trip from start to stop with a smart interactive map.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="m10.2 6.3..." />
        </svg>
      )
    },
    {
      title: "Travel Analytics",
      feature: "Review your ride stats, distance covered, cost saved, and more—all in one place.",
      link: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 12c.552..." />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-b from-lime-50 to-lime-200 min-h-screen">
      {/* Hero Section */}
      <section className="pt-65 pb-65 px-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          Carpooling, made simple with <br></br>
          <div class="relative inline-flex">
              <span class="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]"></span>
              <h1 class="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl">Envo.</h1>
          </div>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mt-4">
          Plan rides, reduce carbon footprints, and build smarter travel habits - <br></br>
          
          <b>all in one place.</b>
        </p>
        <div className="mt-8">
          <a
            href="/explore"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Start Exploring
          </a>
        </div>
      </section>

      {/* Features Section */}
          <section className="container mx-auto px-4 py-16">
      {features.map((feature, index) => (
        <Brick
          key={index} 
          title={feature.title}
          description={feature.feature} 
          graphic={feature.graphic}
          reverse={index % 2 !== 0} 
        />
      ))}
    </section>

      <section className="py-15 px-20 text-5xl sm:text-6xl font-bold text-gray-900 mb-4 grid grid-cols-2">

        <div className="p-20">
          <div class="relative inline-flex">
              <span class="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]"></span>
              <h1 class="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl">Log In</h1>
          </div>
         
         <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mt-4">
          View past trips, tailored suggestions, support resources, <b>and more</b>.</p>
                <button
      className="
        inline-flex items-center justify-center flex-auto
        bg-white text-gray-900
        rounded-xl
        shadow-[transparent_0_0_0_3px,rgba(18,18,18,.1)_0_6px_20px]
        hover:shadow-[#121212_0_0_0_3px,transparent_0_0_0_0]
        cursor-pointer
        font-inter font-bold text-xl leading-none
        py-4 px-5
        outline-none border-0 select-none touch-manipulation
        whitespace-nowrap
        transition-shadow duration-200
      "
      role="button"
    >
      Login 
    </button>
        </div>

        <div className="bg-blue border-l border-grey-400 p-20">

        <div class="relative inline-flex">
              <span class="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]"></span>
              <h1 class="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl">Register</h1> 
          </div>
         
         <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mt-4">
          I'm new here! <br></br>where do I sign up? <br></br></p>
                <button
      className="
        inline-flex items-center justify-center flex-auto
        bg-white text-gray-900
        rounded-xl
        shadow-[transparent_0_0_0_3px,rgba(18,18,18,.1)_0_6px_20px]
        hover:shadow-[#121212_0_0_0_3px,transparent_0_0_0_0]
        cursor-pointer
        font-inter font-bold text-xl leading-none
        py-4 px-5
        outline-none border-0 select-none touch-manipulation
        whitespace-nowrap
        transition-shadow duration-200
      "
      role="button"
    >
      Register
    </button>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-30 bg-white px-20">
          <div class="relative inline-flex">
              <span class="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]"></span>
              <h1 class="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl pt-15">Testimonials</h1> 
          </div>
        <p className="text-lg text-gray-600 mt-2">
          Hear what other users - have to say!
        </p>
        <div className="mt-6 flex justify-center pb-15">
          <Card title={"Willam Dierich"} feature ={"Great app, the founder is on track to be an absolute tech god."}>
          </Card>
          <Card title={"Elon Musk"} feature ={"Can I buy this from you?"}>
          </Card>
          <Card title={"Josh"} feature ={"Slay queen."}>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Ready to ride with Envo?</h2>
        <p className="text-lg text-gray-600 mt-2">
          Join thousands of smart commuters today and start saving on every trip.
        </p>
        <div className="mt-6">
          <a
            href="/signup"
            className="bg-lime-600 hover:bg-lime-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition"
          >
            Get Started
          </a>
        </div>
      </section>
      {/* Testimonials */}

    </div>
  );
}

export default Landing;

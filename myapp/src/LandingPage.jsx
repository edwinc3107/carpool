import React from "react";
import Card from "./assets/Card";
import Brick from "./assets/Brick";

function Landing() {
  const features = [
    {
      title: "Smart Routes",
      description: "Get matched with riders heading in your direction—even if they’re joining from in-between stops.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 5a3 3 0 1 0-5.997.125..." />
        </svg>
      )
    },
    {
      title: "Sustainability Board",
      description: "See how much CO₂ you’ve saved and your impact on fuel usage with every shared ride.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M7 19H4.815..." />
        </svg>
      )
    },
    {
      title: "Flexible Ride Hosting",
      description: "Host rides on your terms—set stops, choose passengers, and manage everything easily.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 19l-1.106..." />
        </svg>
      )
    },
    {
      title: "Ride Alerts",
      description: "Instantly get notified when new riders join your trip or when matching rides pop up.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M7 18v-6a5 5..." />
        </svg>
      )
    },
    {
      title: "Route Planner",
      description: "Visualize your trip from start to stop with a smart interactive map.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="m10.2 6.3..." />
        </svg>
      )
    },
    {
      title: "Travel Analytics",
      description: "Review your ride stats, distance covered, cost saved, and more—all in one place.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 12c.552..." />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-b from-lime-50 to-lime-200 min-h-screen font-sans text-gray-900">
      
      {/* HERO SECTION */}
      <section className="text-center pt-32 p-34 px-6 relative">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4">
          Carpool smarter with <br className="hidden sm:block" />
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-0 border-b-8 border-lime-400"></span>
            <span className="relative text-lime-900">Envo.</span>
          </span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mt-4">
          Plan rides, reduce carbon footprints, and build smarter travel habits — <b>all in one place.</b>
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a href="/signup" className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 rounded-lg font-semibold transition">
            Get Started
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-24 grid gap-16">
        {features.map((feature, i) => (
          <Brick
            key={i}
            title={feature.title}
            description={feature.description}
            graphic={feature.icon}
            reverse={i % 2 !== 0}
          />
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-24 px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-lime-800 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { step: "1", title: "Find or Host Rides", desc: "Enter your trip details or offer a ride to others." },
            { step: "2", title: "Connect Safely", desc: "Match with riders or drivers in your direction." },
            { step: "3", title: "Travel & Save", desc: "Share costs, track rides, and reduce CO₂ footprint." }
          ].map((item, idx) => (
            <div key={idx} className="bg-lime-50 rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="text-4xl font-bold text-lime-600 mb-4">{item.step}</div>
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 text-center relative bg-gradient-to-t from-lime-100 to-lime-50">
        <h2 className="text-4xl sm:text-5xl font-bold text-lime-900 mb-4">What Our Users Say</h2>
        <p className="text-gray-700 mb-12">Hear from our community and see why they love Envo.</p>
        <div className="flex flex-wrap justify-center gap-8">
          <Card title="William Dierich" feature="Great app, the founder is on track to be a tech god!" />
          <Card title="Elon Musk" feature="Can I buy this from you?" />
          <Card title="Josh" feature="Helpful product." />
        </div>
        <p className="text-gray-500 italic mt-12">
          "I always aim to put our customers first and solve problems I've lived through. Experience is king." <br />
          — Edwin, CEO & Founder
        </p>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to ride with Envo?</h2>
        <p className="text-gray-700 mb-8">Join thousands of smart commuters and save on every trip.</p>
        <a href="/register" className="bg-lime-600 hover:bg-lime-700 text-white px-10 py-5 rounded-full text-xl font-semibold transition">
          Get Started
        </a>
      </section>

    </div>
  );
}

export default Landing;

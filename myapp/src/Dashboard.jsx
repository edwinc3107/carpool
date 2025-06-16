import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import Card from './assets/Card';

function Dashboard(){
    const { user } = useContext(UserContext);
    const features = [
  {
    title: "Smart Routes",
    features: "Matches riders with hosts going the same way, even with intermediate stops.",
    link: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>
  },
  {
    title: "Sustainability Board",
    features: "Track CO₂ saved, fuel reduced, and your eco-impact from shared rides.",
    link: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-recycle-icon lucide-recycle"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>
  },
  {
    title: "Flexible Ride Hosting",
    features: "Create and manage your rides, choose your stops, and communicate easily.",
    link:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-plus-icon lucide-map-plus"><path d="m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V12"/><path d="M15 5.764V12"/><path d="M18 15v6"/><path d="M21 18h-6"/><path d="M9 3.236v15"/></svg>
  },
  {
    title: "Ride Alerts",
    features: "Get notified instantly when a ride is available or someone joins your route.",
    link:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-siren-icon lucide-siren"><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/><path d="M12 12v6"/></svg>
  },
  {
    title: "Route Planner",
    features: "Visualize your trip, stops, and passengers using a smart map UI.",
    link:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waypoints-icon lucide-waypoints"><circle cx="12" cy="4.5" r="2.5"/><path d="m10.2 6.3-3.9 3.9"/><circle cx="4.5" cy="12" r="2.5"/><path d="M7 12h10"/><circle cx="19.5" cy="12" r="2.5"/><path d="m13.8 17.7 3.9-3.9"/><circle cx="12" cy="19.5" r="2.5"/></svg>
  },
  {
    title: "Travel Analytics",
    features: "Review your ride history and analyze cost savings, distances, and trip stats.",
    link:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-pie-icon lucide-chart-pie"><path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/></svg>
  },
];

    useEffect(() => {
        console.log("User context in Dashboard:", user);
    }, [user]);

    return(
        <>
        <Navbar></Navbar>

        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="pt-38 px-20">
        <h1 className="text-3xl font-semibold">
            Welcome, to your portal traveller!
        </h1></div>
        <div className=" py-60 font-semibold text-5xl flex justify-center font-sans text-lime-400">
            Whether you have a ride or looking for a ride, <br></br>it all starts here.
        </div>
                    <h2 className="text-2xl font-semibold px-20 pt-10"> Features: </h2>
        <div className="py-15 grid-rows-3 flex justify-between px-30">
            <div className="flex flex-wrap justify-center gap-6 px-10 py-10">
                {features.map((f) => (
                    <Card Title={f.title} feature={f.features} link={f.link}/>
                ))}
            </div>
        </div>
        <div className= "pt-60 px-65 font-semibold text-5xl flex justify-center font-sans text-lime-400">
            <div>
            Our Mission : to make long-distance travel more efficient, affordable, and human. 
            </div>
        </div>
        <div className="text-2xl font-semibold m-40">
         Whether you're commuting home, heading to a new city, or just passing through — our platform connects drivers and riders heading in the same direction. With intelligent route matching, shared costs, and real-time ride management, we’re building a community where every mile traveled means more saved — in money, fuel, and carbon. Join the movement toward smarter, sustainable travel.
        </div>
        </div>
        </>
    );
}

export default Dashboard;

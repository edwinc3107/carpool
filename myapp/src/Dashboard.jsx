import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";

function Dashboard(){
    const { user } = useContext(UserContext);

    useEffect(() => {
        console.log("User context in Dashboard:", user);
    }, [user]);

    return(
        <div className="w-screen h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center px-4"
            style={{ fontFamily: "Orbitron" }}>
            <h1> Dashboard </h1> <br />
            {!!user && <h2>Hello! {user.name}</h2>}
            {!user && <h2>Loading or not logged in</h2>}
        </div>
    );
}

export default Dashboard;

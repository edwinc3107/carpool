import Navbar from "./Navbar";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";


function ChatRoom(){
    const { user } = useContext(UserContext);
    const getChatMembers = async(req,res) => {
        try{
        const response = await axios.get('/ride-members')
        if(!response){}
           }
        catch(err){
        toast.error(`Unable to ${action === 'approve' ? "approve!" : "deny!"}`, {
                style: {
                    border: "1px solid #84cc16",
                    padding: "16px",
                    color: "#A3E635",
                    background: "#1f2937",
                },
                iconTheme: {
                    primary: "#84cc16",
                    secondary: "#F7FEE7",
                },
                });
    }}


    return(
        <div className="w-full h-full bg-black from-gray-900 to-gray-700 text-lime-400">
            <Navbar></Navbar>
            <div className="bg-gray-700 rounded-2xl p-10 m-10">
                <div className="grid grid-cols-12">
                    <div className=" col-span-4 bg-red-300 p-3">
                        <h2 className="text-5xl font-bold m-4">Chats</h2>
                        {/* Scrollable Chat Box */}
                        <div className="h-100 overflow-y-auto space-y-2 pr-2">
                            {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="border text-black pl-3 pt-3 pb-6 bg-lime-300 rounded"
                            >
                                Chat sample #{i + 1}
                            </div>
                            ))}
                        </div>
                        </div>
                    <div className=" bg-blue-300 col-span-8">

                         <h3 className="text-4xl p-30">
                            Connect - with <br></br>
                            your fellow travellers!
                        </h3>
                        </div>

                </div>

            </div>

        </div>

    );}
export default ChatRoom
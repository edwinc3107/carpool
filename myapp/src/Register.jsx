import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function RegisterSubmit(e) {
    e.preventDefault();

    const data = { name, email, password }; 

    try {
      const response = await axios.post("/register", data);

      if (response.data?.error) {
        toast.error(response.data.error, {
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
      } else {
        toast.success("Registration Successful!", {
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

        setName("");
        setEmail("");
        setPassword("");
        navigate("/login"); // updated route for clarity
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Server error. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-lime-300 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl p-10">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-600 mt-2">Join Envo and start sharing rides smarter, safer, and greener.</p>
        </div>

        <form onSubmit={RegisterSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl border border-lime-500 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl border border-lime-500 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-lime-500 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
            <button title="Log In" className="mt-4 w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 transition">
            Register
            </button>
        </form>
         <div>


       </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <span
              className="text-lime-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

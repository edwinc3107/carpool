import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function LoginSubmit(e) {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await axios.post("/login", data);

      if (response.data && !response.data.error) {
        setEmail("");
        setPassword("");
        setUser(response.data);
        toast.success("Login Successful!", {
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
        navigate("/dashboard");
      } else {
        toast.error(response.data.error || "Login failed", {
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
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-lime-300 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Log in to access your rides and manage your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={LoginSubmit} className="flex flex-col gap-5">
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
            Log in
            </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don’t have an account?{" "}
            <span
              className="text-lime-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

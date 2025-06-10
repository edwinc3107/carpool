import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Form from "./assets/Form";


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
        navigate("/l");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Server error. Please try again later.");
    }
  }

  return (
    <div
      className="w-screen h-screen bg-gradient-to-br to-gray-700 text-white flex justify-center items-center"
      style={{ fontFamily: "Orbitron" }}
    >
      <div className="flex justify-center gap-2 py-4">
        <Form title="Welcome, register here!" onSubmit={RegisterSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full p-2 rounded text-lime-400 border border-lime-400 placeholder-lime-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded text-lime-400 border border-lime-400 placeholder-lime-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 rounded text-lime-400 border border-lime-400 placeholder-lime-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form>
      </div>
    </div>
  );
}

export default Register;

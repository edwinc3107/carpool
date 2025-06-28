import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Form from "./assets/Form";
import Button from "./Button"; 
import { UserContext } from "./context/UserContext";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  async function LoginSubmit(e) {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await axios.post("/login", data);

      if (response.data && !response.data.error) {
        setEmail("");
        setPassword("");
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
        setUser(response.data);
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
      console.log(err);
      toast.error("Something went wrong. Check console.");
    }
  }

  return (
    <div
      className="w-screen h-screen bg-gradient-to-br to-gray-700 text-white flex justify-center items-center"
      style={{ fontFamily: "Orbitron" }}
    >
      <div className="flex justify-center gap-2 py-4">
        <Form title="Login" onSubmit={LoginSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded border border-lime-400 text-lime-400 placeholder-lime-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 rounded border border-lime-400 text-lime-400 placeholder-lime-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form>
      </div>
    </div>

  )
}

export default Login;

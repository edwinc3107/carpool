import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from '../context/UserContext';

function Popup({ onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLogout() {
    setLoading(true); // Show spinner
    try {
      await axios.post("/logout");
      setUser(null)
      setTimeout(() => {
        navigate("/"); // Redirect after 1.5s
      }, 1500);
    } catch (err) {
      console.error("Logout failed", err);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white text-gray-900 shadow-xl p-8 w-96 relative rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h4 className="text-md pt-5 px-4 text-center font-medium">
          {loading ? "Logging you out..." : "Are you sure you want to logout?"}
        </h4>

        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-lime-500 text-white hover:bg-lime-600"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Popup;

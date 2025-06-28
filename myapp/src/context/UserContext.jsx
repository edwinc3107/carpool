import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // add loading state

  useEffect(() => {
    axios.get('/profile')
      .then(({ data }) => {
        if (data) setUser(data);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setUser(null);
      })
      .finally(() => setLoading(false)); // loading is done
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-lg">
        Loading your portal...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

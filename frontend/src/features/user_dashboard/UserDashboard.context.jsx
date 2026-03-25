import { createContext, useState } from "react";

export const UserDashboardContext = createContext();

export const UserDashboardProvider = ({ children }) => {

  const [joinedMatches, setJoinedMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <UserDashboardContext.Provider
      value={{
        joinedMatches,
        setJoinedMatches,
        loading,
        setLoading
      }}
    >
      {children}
    </UserDashboardContext.Provider>
  );
};
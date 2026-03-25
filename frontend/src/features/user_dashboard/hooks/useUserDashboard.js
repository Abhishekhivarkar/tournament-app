import { useContext } from "react";
import { UserDashboardContext } from "../UserDashboard.context";
import { getJoinedMatches } from "../services/userDashboard.api";

export const useUserDashboard = () => {

  const context = useContext(UserDashboardContext);

  if (!context) {
    throw new Error("useUserDashboard must be used within DashboardProvider");
  }

  const {
    joinedMatches,
    setJoinedMatches,
    loading,
    setLoading
  } = context;

  const handleGetJoinedMatches = async () => {

    try {

      setLoading(true);

      const data = await getJoinedMatches();

      if (data && !data.error) {
        setJoinedMatches(data.data);
      }

      return data;

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return {
    loading,
    joinedMatches,
    handleGetJoinedMatches
  };

};
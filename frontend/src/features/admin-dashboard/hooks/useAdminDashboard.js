import { useContext } from "react";
import { AdminDashboardContext } from "../AdminDashboard.context";
import {
  getAllTournaments,
  getAllUsers,
  getRegisteredUsers,
  getTotalCollectionOfTournament,
  getWithdrawRequests,
} from "../services/adminDashboard.api";

export const useAdminDashboard = () => {

  const context = useContext(AdminDashboardContext);

  if (!context) {
    throw new Error("useAdminDashboard must be used within AdminDashboardProvider");
  }

  const {
    loading,
    setLoading,
    users,
    setUsers,
    tournaments,
    setTournaments,
    registeredUsers,
    setRegisteredUsers,
    collection,
    setCollection,
    withdrawRequests,
    setWithdrawRequests,
  } = context;

  const handleGetAllUsers = async () => {

    try {

      setLoading(true);

      const data = await getAllUsers();

      if (data && data.data) {
        setUsers(data.data);
        return data.data;
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleGetAllTournaments = async () => {

    try {

      setLoading(true);

      const data = await getAllTournaments();

      if (data && data.data) {
        setTournaments(data.data);
        return data.data;
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleGetRegisteredUsers = async (id) => {

    try {

      setLoading(true);

      const data = await getRegisteredUsers(id);

      if (data && data.data) {
        setRegisteredUsers(data.data);
        return data.data;
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleGetWithdrawRequests = async () => {

    try {

      setLoading(true);

      const data = await getWithdrawRequests();

      if (data && data.data) {
        setWithdrawRequests(data.data);
        return data.data;
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleGetTotalCollectionOfTournaments = async (id) => {

    try {

      setLoading(true);

      const data = await getTotalCollectionOfTournament(id);

      if (data) {
        setCollection(data);
        return data;
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return {
    loading,
    users,
    tournaments,
    registeredUsers,
    collection,
    withdrawRequests,
    handleGetAllUsers,
    handleGetAllTournaments,
    handleGetRegisteredUsers,
    handleGetWithdrawRequests,
    handleGetTotalCollectionOfTournaments,
  };

};
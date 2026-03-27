import { useContext } from "react";
import { TransactionContext } from "../transaction.context";

import {
  getMyTransactions,
  requestWithdraw
} from "../services/transaction.api";

export const useTransaction = () => {

  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransaction must be used within TransactionProvider");
  }

  const {
    transactions,
    setTransactions,
    page,
    setPage,
    limit,
    totalPages,
    setTotalPages,
    totalTransactions,
    setTotalTransactions,
    loading,
    setLoading
  } = context;


 const handleGetMyTransactions = async (customPage = page) => {

  try {

    setLoading(true)

    const data = await getMyTransactions(customPage, limit)

    if (!data || data.err) return

    setTransactions(data.data)   // 👈 IMPORTANT FIX
    setTotalPages(data.totalPages)
    setTotalTransactions(data.totalTransactions)
    setPage(data.page)

  } catch (err) {

    console.log(err)

  } finally {

    setLoading(false)

  }

}


  const handleWithdrawRequest = async (amount) => {

    try {

      setLoading(true);

      const data = await requestWithdraw(amount);

      if (!data || data.err) {
        return data;
      }

      await handleGetMyTransactions();

      return data;

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };


  return {

    transactions,
    page,
    totalPages,
    totalTransactions,
    loading,

    handleGetMyTransactions,
    handleWithdrawRequest
  };

};
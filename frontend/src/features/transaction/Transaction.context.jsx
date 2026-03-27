import { createContext, useState } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {

  const [transactions, setTransactions] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [loading, setLoading] = useState(false);

  return (
    <TransactionContext.Provider value={{
        transactions,
        setTransactions,

        page,
        setPage,

        limit,
        setLimit,

        totalPages,
        setTotalPages,

        totalTransactions,
        setTotalTransactions,

        loading,
        setLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
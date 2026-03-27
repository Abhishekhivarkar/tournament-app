import { useEffect } from "react"
import { useTransaction } from "../hooks/useTransaction"

export default function TransactionHistory() {

  const {
    transactions,
    loading,
    page,
    totalPages,
    handleGetMyTransactions
  } = useTransaction()

  useEffect(() => {
    handleGetMyTransactions()
  }, [])

  const handleNext = () => {
    if (page < totalPages) {
      handleGetMyTransactions(page + 1)
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      handleGetMyTransactions(page - 1)
    }
  }

  return (

    <div className="max-w-6xl mx-auto mt-10">

      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        My Transactions
      </h1>

      <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">

        {loading ? (

          <p className="text-gray-400">Loading transactions...</p>

        ) : transactions.length === 0 ? (

          <p className="text-gray-400">
            No transactions found
          </p>

        ) : (

          <table className="w-full text-left">

            <thead>

              <tr className="text-blue-400 border-b border-blue-900/40">

                <th className="py-3">Type</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3">Notes</th>
                <th className="py-3">Date</th>

              </tr>

            </thead>

            <tbody>

  {transactions.map((t) => {

    console.log(t)   // 👈 Yaha

    return (
      <tr
        key={t._id}
        className="border-b border-blue-900/20"
      >

        <td className="py-3 text-white font-semibold">
  {t.type || "N/A"}
</td>

        <td className="py-3 text-green-400">
          ₹{t.amount}
        </td>

        <td className="py-3">

          <span
            className={
              t.status === "SUCCESS"
                ? "text-green-400"
                : t.status === "PENDING"
                ? "text-yellow-400"
                : "text-red-400"
            }
          >
            {t.status}
          </span>

        </td>

        <td className="py-3 text-gray-400">
          {t.notes}
        </td>

        <td className="py-3 text-gray-400">
          {new Date(t.createdAt).toLocaleString()}
        </td>

      </tr>
    )
  })}

</tbody>

          </table>

        )}

      </div>

      {/* Pagination */}

      <div className="flex justify-between mt-6">

        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Prev
        </button>

        <span className="text-gray-400">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Next
        </button>

      </div>

    </div>
  )
}
import { useState } from "react"
import { useTransaction } from "../hooks/useTransaction"
import toast from "react-hot-toast"
import { useAuth } from "../../auth/hooks/useAuth"

export default function Withdraw() {
const { user } = useAuth()
  const { handleWithdrawRequest, loading } = useTransaction()

  const [amount, setAmount] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount")
      return
    }

    const data = await handleWithdrawRequest(Number(amount))

    if (!data || data.err) {
      toast.error(data?.message || "Withdraw request failed")
      return
    }

    toast.success("Withdraw request submitted")

    setAmount("")
  }

  return (

    <div className="max-w-xl mx-auto mt-10">

      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        Withdraw Balance
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40"
      >
        <p className="text-gray-400 mb-4">
        Available Withdraw Balance:
        <span className="text-green-400 ml-2">
          ₹{user?.withdrawBalance || 0}
        </span>
      </p>
        <input
  type="number"
  placeholder="Enter withdraw amount"
  value={amount}
  onChange={(e)=>setAmount(e.target.value)}
  className="w-full p-3 mb-4 bg-[#020617] border border-blue-900/40 rounded text-white"
/>

        <button
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded font-semibold"
        >
          {loading ? "Processing..." : "Request Withdraw"}
        </button>

      </form>

    </div>

  )
}
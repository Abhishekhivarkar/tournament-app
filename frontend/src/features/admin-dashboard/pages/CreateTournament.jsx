import { useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { createTournament } from "../../tournament/services/tournament.api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function CreateTournament() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    map: "erangle",
    entryFee: "",
    maxPlayers: 100,
    prizePoolPercentage: 85,
    startTime: ""
  })

  const [loading,setLoading] = useState(false)

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    setLoading(true)

    const data = await createTournament({
      ...form,
      prizeDistribution:[
        { position:1, percentage:50 },
        { position:2, percentage:30 },
        { position:3, percentage:20 }
      ]
    })

    if(!data || data.err){
      toast.error(data?.message || "Failed to create tournament")
      setLoading(false)
      return
    }

    toast.success("Tournament created 🎮")

    navigate("/admin/tournaments")

    setLoading(false)
  }

  return (

    <AdminLayout>

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          Create Tournament
        </h1>

        <form
        onSubmit={handleSubmit}
        className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40 space-y-4"
        >

          <input
          name="title"
          placeholder="Tournament Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 bg-[#020617] border border-blue-900/40 rounded"
          />

          <select
          name="map"
          value={form.map}
          onChange={handleChange}
          className="w-full p-3 bg-[#020617] border border-blue-900/40 rounded"
          >

            <option value="erangle">Erangle</option>
            <option value="livik">Livik</option>
            <option value="tdm">TDM</option>

          </select>

          <input
          type="number"
          name="entryFee"
          placeholder="Entry Fee"
          value={form.entryFee}
          onChange={handleChange}
          className="w-full p-3 bg-[#020617] border border-blue-900/40 rounded"
          />

          <input
          type="number"
          name="maxPlayers"
          placeholder="Max Players"
          value={form.maxPlayers}
          onChange={handleChange}
          className="w-full p-3 bg-[#020617] border border-blue-900/40 rounded"
          />

         <input
type="datetime-local"
name="startTime"
value={form.startTime}
onChange={handleChange}
required
className="w-full p-3 bg-[#020617] border border-blue-900/40 rounded"
/>

          <button
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded font-semibold"
          >
            {loading ? "Creating..." : "Create Tournament"}
          </button>

        </form>

      </div>

    </AdminLayout>
  )
}
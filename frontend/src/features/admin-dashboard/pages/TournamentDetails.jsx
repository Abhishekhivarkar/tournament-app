import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import { useAdminDashboard } from "../hooks/useAdminDashboard"
import {
  declareWinners,
  cancelTournament
} from "../../tournament/services/tournament.api"
import toast from "react-hot-toast"

export default function TournamentDetails() {
  const [firstWinner,setFirstWinner] = useState("")
const [secondWinner,setSecondWinner] = useState("")
const [thirdWinner,setThirdWinner] = useState("")
  const { id } = useParams()

  const {
    collection,
    handleGetTotalCollectionOfTournaments
  } = useAdminDashboard()

  // const [roomId,setRoomId] = useState("")
  // const [roomPassword,setRoomPassword] = useState("")

  // const [status,setStatus] = useState("upcoming")

  // const [winnerUserId,setWinnerUserId] = useState("")
  // const [winnerPosition,setWinnerPosition] = useState("")

  useEffect(()=>{
    handleGetTotalCollectionOfTournaments(id)
  },[])

  // const handleRoomUpdate = async ()=>{

  //   const data = await setRoomDetails(id,{
  //     roomId,
  //     roomPassword
  //   })

  //   if(!data || data.err){
  //     toast.error(data?.message || "Failed to update room")
  //     return
  //   }

  //   toast.success("Room details updated")
  // }

  const handleDeclareWinner = async ()=>{

    if(!firstWinner || !secondWinner || !thirdWinner){
  toast.error("Please enter all 3 winners")
  return
}
const data = await declareWinners(id,{
  winners:[
    { userId:firstWinner, position:1 },
    { userId:secondWinner, position:2 },
    { userId:thirdWinner, position:3 }
  ]
})

if(!data || data.err){
  toast.error(data?.message || "Failed to declare winners")
  return
}

toast.success("Winners declared")
}

  const handleCancelTournament = async ()=>{

    const data = await cancelTournament(id)

    if(!data || data.err){
      toast.error(data?.message || "Failed to cancel tournament")
      return
    }

    toast.success("Tournament cancelled")
  }

  return (

    <AdminLayout>

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl text-cyan-400 mb-6">
          Tournament Management
        </h1>

        {/* Collection */}

        <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40">

          <h2 className="text-xl text-blue-400 mb-4">
            Tournament Collection
          </h2>

          {collection && (

            <div className="space-y-2">

              <p className="text-gray-300">
                Title: {collection.title}
              </p>

              <p className="text-gray-300">
                Entry Fee: ₹{collection.entryFee}
              </p>

              <p className="text-green-400 text-xl font-bold">
                Total Cash: ₹{collection.totalCash}
              </p>

            </div>

          )}

        </div>


        {/* Room Details */}

        {/* <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40 mt-6">

          <h2 className="text-xl text-blue-400 mb-4">
            Room Details
          </h2>

          <input
          placeholder="Room ID"
          value={roomId}
          onChange={(e)=>setRoomId(e.target.value)}
          className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
          />

          <input
          placeholder="Room Password"
          value={roomPassword}
          onChange={(e)=>setRoomPassword(e.target.value)}
          className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
          />

          <button
          onClick={handleRoomUpdate}
          className="bg-blue-600 px-4 py-2 rounded"
          >
            Update Room
          </button>

        </div> */}


        {/* Update Status */}

        {/* <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40 mt-6">

          <h2 className="text-xl text-blue-400 mb-4">
            Update Tournament Status
          </h2>

          <select
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
          className="bg-[#020617] border border-blue-900/40 p-2 rounded mr-4"
          >

            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>

          </select>

          <button className="bg-cyan-500 px-4 py-2 rounded">
            Update Status
          </button>

        </div> */}

        <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-900/40 mt-6">

          <h2 className="text-xl text-blue-400 mb-4">
            Declare Winner
          </h2>

          {/* <input
          placeholder="User ID"
          value={winnerUserId}
          onChange={(e)=>setWinnerUserId(e.target.value)}
          className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
          />

          <input
          placeholder="Position"
          value={winnerPosition}
          onChange={(e)=>setWinnerPosition(e.target.value)}
          className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
          /> */}

          <input
placeholder="1st Place User ID"
value={firstWinner}
onChange={(e)=>setFirstWinner(e.target.value)}
className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
/>

<input
placeholder="2nd Place User ID"
value={secondWinner}
onChange={(e)=>setSecondWinner(e.target.value)}
className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
/>

<input
placeholder="3rd Place User ID"
value={thirdWinner}
onChange={(e)=>setThirdWinner(e.target.value)}
className="w-full mb-3 p-2 bg-[#020617] border border-blue-900/40 rounded"
/>

          <button
          onClick={handleDeclareWinner}
          className="bg-green-600 px-4 py-2 rounded"
          >
            Declare Winner
          </button>

        </div>


        <div className="mt-6">

          <button
          onClick={handleCancelTournament}
          className="bg-red-600 px-4 py-2 rounded"
          >
            Cancel Tournament
          </button>
        </div>

      </div>

    </AdminLayout>
  )
}
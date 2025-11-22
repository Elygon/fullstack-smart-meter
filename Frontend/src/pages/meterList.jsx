import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const MeterList = () => {
  const [meters, setMeters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMeters = async () => {
      try {
        const res = await axios.post("http://localhost:4885/meter/all")
        setMeters(res.data.meters || [])
      } catch (err) {
        console.error(err)
        setError("Failed to fetch meters")
      } finally {
        setLoading(false)
      }
    }
    fetchMeters()
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading meters...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left dark panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">Smart Meter Portal</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    Here you can see all your registered meters and their latest readings.
                    Click on any meter to view its detailed readings and status.
                </p>
            </div>

            {/* Right content panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        My Meters
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Below are all meters currently registered in the system.
                    </p>

                    {meters.length === 0 ? (
                        <p className="text-gray-600 text-center">No meters found.</p>
                    ) : (
                        <div className="space-y-4">
                            {meters.map((meter) => (
                                <div
                                    key={meter._id}
                                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {meter.name || `Meter ${meter._id}`}
                                        </p>
                                        <p className="text-sm mt-1 text-gray-600">
                                            Status: {meter.status || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Last Reading: {meter.lastReading ? meter.lastReading.energy_consumed + " kWh" : "N/A"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            navigate("/readings", { state: { meterId: meter._id } })
                                        }
                                        className="px-4 py-2 bg-[#0f172a] text-white text-sm rounded-lg hover:bg-[#1e293b] transition"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MeterList

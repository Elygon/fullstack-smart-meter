import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const MeterDetails = ({ meterId }) => {
  const navigate = useNavigate()
  const [meter, setMeter] = useState(null)
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (!meterId) {
      setError("No meter selected yet.")
      return
    }

    const fetchMeterDetails = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await axios.post(
          "https://fullstack-smart-meter.onrender.com/meter/single",
          { meterId } // Backend expects 'meterId'
        );

        if (res.data.status === "ok") {
          const fetchedReadings = res.data.readings || [];
          const fetchedMeter = fetchedReadings[0]?.meter || res.data.meter || null

          setReadings(fetchedReadings)
          setMeter(fetchedMeter)
        } else {
          setError(res.data.msg || "Failed to fetch meter details");
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Error fetching meter details")
      } finally {
        setLoading(false)
      }
    }

    fetchMeterDetails()
  }, [meterId])

  const handleDelete = async () => {
    if (!window.confirm("Delete this meter?")) return

    try {
      await axios.post("https://fullstack-smart-meter.onrender.com/meter/delete", { meterId })
      setSuccessMsg("Meter deleted successfully!")
      setTimeout(() => navigate("/dashboard"), 2000)
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete meter.")
    }
  }

  if (!meterId) return <p className="text-gray-500">No meter selected.</p>
  if (loading) return <p className="text-gray-500 animate-pulse">Loading meter details...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!meter) return <p className="text-gray-500">Meter not found yet.</p>

  return (
    <div className="flex flex-col bg-gray-50 p-6 rounded-2xl shadow-lg mb-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          Delete Meter
        </button>
      </div>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <h2 className="text-2xl font-bold mb-2">{meter.name}</h2>
      <p><span className="font-semibold">Serial Number:</span> {meter.serialNumber}</p>
      <p><span className="font-semibold">Location:</span> {meter.location}</p>
      <p><span className="font-semibold">Status:</span> {meter.status}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Meter Readings</h3>
      {readings.length === 0 ? (
        <p className="text-gray-500">No readings yet.</p>
      ) : (
        <div className="grid gap-4">
          {readings.map((reading) => (
            <div key={reading._id} className="bg-white p-4 border rounded-xl shadow-sm hover:shadow-md transition">
              <p><span className="font-semibold">Date:</span> {new Date(reading.timestamp).toLocaleString()}</p>
              <p><span className="font-semibold">Energy:</span> {reading.energy_consumed} kWh</p>
              <p><span className="font-semibold">Voltage:</span> {reading.voltage} V</p>
              <p><span className="font-semibold">Current:</span> {reading.current} A</p>
              <p><span className="font-semibold">Status:</span> {reading.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MeterDetails
import React, { useEffect, useState } from "react"
import { io } from "socket.io-client"
import MeterDetails from "../components/meterDetails"       // make sure the path is correct
import LiveReadingCard from "../components/liveReadingCard" // make sure the path is correct

const socket = io("https://fullstack-smart-meter.onrender.com") // Your backend URL

const Readings = ({ meterId }) => {
  const [readings, setReadings] = useState([])
  const [selectedReading, setSelectedReading] = useState(null)
  const [message, setMessage] = useState("")

  // Fetch initial readings once
  useEffect(() => {
    const fetchInitialReadings = async () => {
      try {
        const res = await fetch("https://fullstack-smart-meter.onrender.com/readings/view", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meter: meterId })
        })
        const data = await res.json()
        setReadings(data.readings || [])
      } catch (e) {
        console.error("Error fetching initial readings:", e)
        setMessage("Failed to fetch readings.")
      }
    }
    fetchInitialReadings()
  }, [meterId])

  // Websocket listener for new readings
  useEffect(() => {
    socket.on('new-reading', (reading) => {
      if (reading.meter._id === meterId) {
        setReadings(prev => [reading, ...prev]) // Prepend newest reading
      }
    })

    return () => socket.off("new-reading")
  }, [meterId])

  // View a specific reading's details
  const viewReading = (reading) => {
    setSelectedReading(reading)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">Smart Meter</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Monitor your real-time meter readings, energy consumption and power status.
          Data updates instantly as new readings arrive.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          
          {/* Show Meter Details at the top */}
          <MeterDetails meterId={meterId} />

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center mt-6">
            Meter Readings
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Track your latest readings, voltage and energy usage
          </p>

          {message && (
            <p className="text-center text-red-600 mb-4 font-medium">
              {message}
            </p>
          )}

          {readings.length === 0 ? (
            <p className="text-gray-500 text-center">No readings found.</p>
          ) : (
            <ul className="space-y-3">
              {readings.map((reading) => (
                <LiveReadingCard
                  key={reading._id}
                  reading={reading}
                  onView={viewReading}
                />
              ))}
            </ul>
          )}

          {/* Selected Reading Details */}
          {selectedReading && (
            <div className="mt-6 bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                Reading Details
              </h3>
              <div className="space-y-1 text-gray-700 text-sm">
                <p>
                  <span className="font-semibold">ID:</span>{" "}
                  {selectedReading._id}
                </p>
                <p>
                  <span className="font-semibold">Meter:</span>{" "}
                  {selectedReading.meter?.name || selectedReading.meter?._id}
                </p>
                <p>
                  <span className="font-semibold">Energy Consumed:</span>{" "}
                  {selectedReading.energy_consumed} kWh
                </p>
                <p>
                  <span className="font-semibold">Voltage:</span>{" "}
                  {selectedReading.voltage} V
                </p>
                <p>
                  <span className="font-semibold">Current:</span>{" "}
                  {selectedReading.current} A
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedReading.status}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedReading.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Readings

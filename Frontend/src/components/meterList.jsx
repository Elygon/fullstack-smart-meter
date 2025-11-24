import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const MeterList = () => {
    const [meters, setMeters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const res = await axios.post("https://fullstack-smart-meter.onrender.com/meter/all")
                setMeters(res.data.meters || [])
                setLoading(false)
            } catch (err) {
                console.error(err)
                setError("Failed to fetch meters")
                setLoading(false)
            }
        }
        fetchMeters()
    }, [])

    if (loading) {
        return <p className="text-gray-500 animate-pulse">Loading meters...</p>
    }

    if (error) {
        return <p className="text-red-600">{error}</p>
    }

    if (meters.length === 0) {
        return <p className="text-gray-500">No meters found.</p>
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {meters.map((meter) => (
                <Link
                    key={meter._id}
                    to={`/readings`}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                >
                    <h4 className="text-lg font-bold mb-1">{meter.name || `Meter ${meter._id}`}</h4>
                    <p className="text-gray-600 text-sm">
                        Status: {meter.status || "Unknown"}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Last Reading: {meter.lastReading ? meter.lastReading.energy_consumed + " kWh" : "N/A"}
                    </p>
                </Link>
            ))}
        </div>
    )
}

export default MeterList

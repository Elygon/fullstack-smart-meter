import React from "react"

const LiveReadingCard = ({ reading, onView }) => {
    return (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition">
            <div className="text-sm text-gray-700 space-y-1">
                <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(reading.timestamp).toLocaleString()}
                </p>
                <p>
                    <span className="font-semibold">Energy:</span>{" "}
                    {reading.energy_consumed} kWh
                </p>
                <p>
                    <span className="font-semibold">Voltage:</span>{" "}
                    {reading.voltage} V
                </p>
                <p>
                    <span className="font-semibold">Current:</span>{" "}
                    {reading.current} A
                </p>
                <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {reading.status}
                </p>
            </div>
            <button
                onClick={() => onView(reading)}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm px-3 py-1.5 rounded-lg transition"
            >
                View Details
            </button>
        </div>
    )
}

export default LiveReadingCard
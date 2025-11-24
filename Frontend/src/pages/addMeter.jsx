import React, { useState } from "react"
import axios from "axios"

const AddMeter = () => {
    const [name, setName] = useState("")
    const [serialNumber, setSerialNumber] = useState("")
    const [location, setLocation] = useState("")
    const [status, setStatus] = useState("active")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    
    const handleAddMeter = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        if (!name || !serialNumber || !location || !status) {
            setMessage("All fields must be filled")
            setLoading(false)
            return
        }
        
        try {
            const res = await axios.post(
                "https://fullstack-smart-meter.onrender.com/meter/add",
                { name, serialNumber, location, status }
            )
            
            if (res.data.status === 'ok') {
                setMessage(res.data.msg || "Meter added successfully!")
                setName("")
                setSerialNumber("")
                setLocation()
                setStatus("active")
            } else {
                setMessage(res.data.msg || "Failed to add meter")
            }
        } catch (err) {
            console.error("Add meter error", err)
            setMessage(err.response?.data?.msg || "Error adding for meter")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left side panel (same as login/signup) */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">Smart Meter Portal</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    Register a new smart meter to monitor it in real-time. Fill in the details below and get it connected immediately.
                </p>
            </div>
            
            {/* Right panel (form) */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Add New Meter
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Enter the meter details to connect it to your smart meter system.
                    </p>
                    
                    <form onSubmit={handleAddMeter} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meter Name
                            </label>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter meter name"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        {/* Serial Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Serial Number
                            </label>
                            <input
                                type='text'
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                placeholder="Enter serial number"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            /> 
                        </div>
                        
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter your installation location"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                placeholder="Enter your installation location"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Status --</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition disabled:opacity-60"
                        >
                            {loading ? "Adding..." : "Add Meter"}
                        </button>
                    </form>
                    
                    {/* Response Message */}
                    {message && (
                        <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddMeter
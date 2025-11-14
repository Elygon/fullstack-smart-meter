import React from "react"
import { Link } from "react-router-dom"
import { AlertCircle } from "lucide-react"

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
            <AlertCircle className="w-20 h-20 text-red-500 mb-6" />
            <h1 className="text-5xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oops! Page not found.</p>
            <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
            <Link 
                to="/dashboard" 
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3 rounded-lg transition"
            >
                Go Back Home
            </Link>
        </div>
    )
}

export default NotFound
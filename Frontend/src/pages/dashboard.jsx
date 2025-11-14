import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LayoutDashboard, Power, FileText, Bell, Power, PlusSquare } from "lucide-react"
import MeterList from "../components/meterList"


const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f172a] text-gray-200 flex flex-col p-6 rounded-r-3xl">
                <h1 className="text-2xl font-bold mb-8">Smart Meter Dashboard</h1>
                <nav className="space-y-3">
                    <Link to="/dashboard" className="flex items-center gap-3 bg-[#1e293b] px-4 py-2 rounded-xl font-medium">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/addMeter" className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl">
                        <PlusSquare size={18} /> Add Meter
                    </Link>
                    <Link to="/readings" className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl">
                        <FileText size={18} /> Live Readings
                    </Link>
                    <Link to="/notifications" className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl">
                        <Bell size={18} /> Alerts
                    </Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-10">
                <h2 className="text-2xl font-bold mb-2">Welcome to your Smart Meter Portal ⚡</h2>
                <p className="text-gray-600 mb-8">Overview of your meters and live readings.</p>


                {/* Meter List Component here */}
                <MeterList />

                {/* Quick Actions */}
                <h3 className="text-xl font-semibold mb-4 mt-10">Quick Actions</h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[
                        {
                            to: "/addMeter",
                            title: "Add New Meter",
                            desc: "Register and connect a new smart meter."
                        },
                        {
                            to: "/readings",
                            title: "Live Readings",
                            desc: "Monitor real-time consumption and meter activity."
                        },
                        {
                            to: "/notifications",
                            title: "View Alerts",
                            desc: "See system warnings or meter issues."
                        }
                    ].map((item, i) => (
                        <Link
                          key={i}
                          to={item.to}
                          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* You can add a section for live readings cards */}
                <h3 className="text-xl font-semibold mb-4">Live Readings</h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                
                    {/* Here you could render LiveReadingCard components */}
                </div>
            </main>
        </div>
    )
}

export default Dashboard
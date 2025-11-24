import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NotificationListener from "../components/notificationListener";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.post(
          "https://fullstack-smart-meter.onrender.com/notification/all"
        );

        if (res?.data?.status === "ok" && Array.isArray(res.data.notifications)) {
          setNotifications(res.data.notifications);
        } else {
          setError(res?.data?.msg || "No notifications available");
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Error fetching notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Stay updated with alerts and important notifications from your smart meters.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Notifications
          </h2>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-600 text-center">No notifications available.</p>
            ) : (
              notifications.map((note) => (
                <Link
                  key={note._id}
                  to="/notificationDetails"
                  state={{ id: note._id }}
                  className={`w-full block px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition ${
                    note.read ? "bg-gray-100 text-gray-500" : "bg-gray-50 text-[#0f172a]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{note.title}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notification listener */}
      <NotificationListener notifications={notifications} setNotifications={setNotifications} />
    </div>
  );
};

export default Notifications
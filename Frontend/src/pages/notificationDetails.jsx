import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

const NotificationDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = location.state || {} // get id from state

  const [notification, setNotification] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) {
      setError("No notification selected")
      return;
    }

    const fetchNotification = async () => {
      try {
        const res = await axios.post("https://fullstack-smart-meter.onrender.com/notification/single")
        const note = res.data.notifications.find((n) => n._id === id);
        if (note) setNotification(note);
        else setError("Notification not found");
      } catch (err) {
        setError("Failed to load notification");
        console.error(err);
      }
    };

    fetchNotification();
  }, [id]);

  const markAsRead = async () => {
    try {
      await axios.post("https://fullstack-smart-meter.onrender.com/notification/mark", { id });
      setNotification((prev) => ({ ...prev, read: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async () => {
    try {
      await axios.post("https://fullstack-smart-meter.onrender.com/notification/delete", { id });
      navigate("/notifications");
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!notification) {
    return <p className="text-gray-600 text-center mt-10">Loading notification...</p>;
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-2">{notification.title}</h2>
        <p className="text-gray-700 mb-2">{notification.message}</p>
        <em className="text-gray-500 text-sm mb-4 block">
          {new Date(notification.createdAt).toLocaleString()}
        </em>

        <div className="flex gap-4">
          {!notification.read && (
            <button
              onClick={markAsRead}
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={deleteNotification}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationDetails
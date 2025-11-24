import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('https://fullstack-smart-meter.onrender.com') // backend server

const NotificationListener = ({ onNewNotification }) => {
    useEffect(() => {
        socket.on('newNotification', (notification) => {
            onNewNotification(notification)
        })

        return () => socket.off('newNotification')
    }, [onNewNotification])

    return null // This component doesn’t render anything
}

export default NotificationListener
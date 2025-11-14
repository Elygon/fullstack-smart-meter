import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4885') // backend server

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
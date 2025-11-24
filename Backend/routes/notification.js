const express = require('express')
const router = express.Router()
const Notification = require('../models/notification')
const { io } = require('../server') // assuming your main server exports Socket.IO instance



/**
 * Endpoint to receive notifications from the smart meter / simulator
 * Example request body:
 * {
 *   type: 'error' | 'warning' | 'success',
 *   title: 'Voltage Alert',
 *   message: 'Voltage exceeded safe limit',
 *   meterId: '64ffabcd1234ef5678'
 * }
 */

router.post('/receive', async (req, res) => {
    const { type, title, message, meterId } = req.body

    if (!type || !title || !message || !meterId) {
        return res.status(400).send({ status: 'error', msg: 'All fields are required' })
    }

    try {
        // Save the notification to the database
        const newNotification = new Notification({
            type,
            title,
            message,
            meter: meterId,
            read: false,
        })

        const savedNotification = await newNotification.save()

        // Emit the notification to the frontend in real-time
        io.emit('newNotification', savedNotification)

        res.status(201).send({ status: 'ok', msg: 'Notification received', notification: savedNotification })
    } catch (err) {
        console.error('Error receiving notification:', err)
        res.status(500).send({ status: 'error', msg: 'Failed to store notification', error: err.message })
    }
})


// Get all notifications
router.post('/all', async (req, res) => { 
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 })
        
        if (!notifications || notifications.length === 0) {
            return res.status(400).send({status: "error", msg: "No notifications found"})
        }

        return res.status(200).send({status: 'ok', msg: 'success', count: notifications.length, notifications})
    } catch (e) {
        console.error(e)
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})


// View a single notification
router.post('/single', async(req, res) => {
    const {id} = req.body

    if(!id) {
        return res.status(400).send({status: 'error', msg: 'ID must be provided'})
    }

    try {
        const notification = await Notification.findById(id)
        
        if (!notification) {
            return res.status(404).send({status: "error", msg: "Notification not found"})
        }
        return res.status(200).send({status: 'ok', msg: 'success', notification})
    } catch (e) {
        console.error(e)
        return res.status(500).send({status: 'error', msg:'Failed to retrieve the notification', error: e.message})
    }  
})


// Mark as read
router.post('/mark', async (req, res) => {
    const {id} = req.body

    if(!id) {
        return res.status(400).send({status: 'error', msg: 'ID must be provided'})
    }

    try {
        const notification = await Notification.findByIdAndUpdate(id, 
            { read: true}, { new: true }
        )

        if (!notification) {
            return res.status(404).send({ status: 'error', msg: 'Notification'})
        }

        return res.status(200).send({ status: 'ok', msg: 'success', notification})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})


// Delete Notification
router.post('/delete', async(req, res) => {
    const {id} = req.body

    if(!id) {
        return res.status(400).send({status: 'error', msg: 'ID must be provided'})
    }

    try {
        //Find the notification by its ID and ensure it belongs to the user
        const deleted = await Notification.findByIdAndDelete(id)
        
        if (!deleted) {
            return res.status(404).send({status: "error", msg: "Notification not found"})
        }
        return res.status(200).send({status: 'ok', msg: 'success', deleted})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})

module.exports = router
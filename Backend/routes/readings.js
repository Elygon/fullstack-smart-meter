const express = require('express')
const Reading = require('../models/readings')
const SmartMeter = require('../models/smartMeter')

module.exports = (io) => {
    const router = express.Router()

    // Add a new reading
    router.post('/add', async (req, res) => {
        try {
            const { meter, energy_consumed, voltage, current, status } = req.body

            // Check if meter exists
            const meterExists = await SmartMeter.findById(meter)
            if (!meterExists)
                return res.status(400).send({ status: 'error', msg: 'Meter not found' })

            // Create new reading
            const reading = new Reading({ meter, energy_consumed, voltage, current, status })
            const savedReading = await reading.save()

            // Emit via WebSocket to all connected clients
            io.emit('new-reading', savedReading)

            res.status(201).send({ status: 'ok', msg: 'Reading saved', reading: savedReading })
        } catch (err) {
            res.status(400).send({ status: 'error', msg: 'Error occurred', error: err.message })
        }
    })


    // Get all readings
    router.post('/all', async (req, res) => {
        try {
            const readings = await Reading.find().populate('meter').sort({ timestamp: -1 })

            if (readings.length === 0) {
                return res.status(200).send({status: "ok", msg: "No readings for now"})
            }
            res.status(200).send({ status: 'ok', msg: 'Readings fetched', count: readings.length, readings })
        } catch (err) {
            res.status(500).send({ status: 'error', msg: 'Error occurred', error: err.message })
        }
    })

  
    // Get readings for a specific meter
    router.post('/view', async (req, res) => {
        try {
            const { meter } = req.body
            const readings = await Reading.find({ meter }).populate('meter').sort({ timestamp: -1 })
            res.status(200).send({ status: 'ok', msg: 'Readings fetched', readings })
        } catch (err) {
            res.status(500).send({ status: 'error', msg: 'Error occurred', error: err.message })
        }
    })


    // Get latest reading for a specific meter
    router.post('/latest', async (req, res) => {
        try {
            const { meter } = req.body
            const latest = await Reading.find({ meter }).sort({ timestamp: -1 }).limit(1).populate('meter')

            if (!latest.length)
            return res.status(404).send({ status: 'error', msg: 'No readings found' })

            res.status(200).send({ status: 'ok', msg: 'Latest reading fetched', reading: latest[0] })
        } catch (err) {
            res.status(500).send({ status: 'error', msg: 'Error occurred', error: err.message })
        }
    })

    return router
}

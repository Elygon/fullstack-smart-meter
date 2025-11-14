const express = require('express')
const router = express.Router()

const SmartMeter = require('../models/smartMeter')
const Reading = require('../models/reading')       


// Get all meters
router.post('/all', async (req, res) => {
    try {
        const meters = await SmartMeter.find()
        res.status(200).send({ status: 'ok', msg: 'Meters fetched', meters })
    } catch (err) {
        res.status(500).send({ status: 'error', msg: 'Error occurred', error: err.message })
   }
})


// Get single meter and its readings
router.post('/single', async (req, res) => {
    try {
        const { meterId } = req.body
        const meter = await SmartMeter.findById(meterId)

        if (!meter) 
            return res.status(404).send({ status: 'error', msg: 'Meter not found' })

        const readings = await Reading.find({ meter: meter._id })
        .populate('meter').sort({ timestamp: -1 })

        res.status(200).send({ status: 'ok', msg: 'Readings fetched', readings })
    } catch (err) {
        res.status(500).send({ status: 'error', msg: 'Error occurred', error: err.message })
    }
})


// Add a new meter
router.post('/add', async (req, res) => {
    const { name, serialNumber, status, location } = req.body

    if (!name || !serialNumber || !status || !location) {
        return res.status(400).send({ status: 'error', msg: 'All fields must be filled'})
    }

    try {
        const meter = new SmartMeter(req.body)
        meter.name = name
        meter.serialNumber = serialNumber
        meter.location = location
        meter.status = 'active' // Initial status

        await meter.save()
        res.status(201).send({ status: 'ok', msg: 'Meter added', meter })
    } catch (err) {
        res.status(400).send({ status: 'error', msg: 'Error occurred', error: err.message })
    }
})


// Update a meter
router.post('/update', async (req, res) => {
    try {
        const { meterId, ...updateData } = req.body
        const updatedMeter = await SmartMeter.findByIdAndUpdate(meterId, updateData, { new: true })
        if (!updatedMeter) 
            return res.status(404).send({ status: 'error', msg: 'Meter not found' })

        res.status(200).send({ status: 'ok', msg: 'Meter updated', meter: updatedMeter })
    } catch (err) {
        res.status(400).send({ status: 'error', msg: 'Error occurred', error: err.message })
    }
})


// Delete a meter
router.post('/delete', async (req, res) => {
    try {
        const { meter } = req.body
        const deletedMeter = await SmartMeter.findByIdAndDelete(meter._id)
        if (!deletedMeter) 
            return res.status(404).send({ status: 'error', msg: 'Meter not found' })

        res.status(200).send({ status: 'ok', msg: 'Meter deleted successfully' })
    } catch (err) {
        res.status(500).send({ status: 'error', msg: 'Error occurred', error: err.message })
    }
})

module.exports = router

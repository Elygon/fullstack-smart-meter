const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    meterId: {type: mongoose.Schema.Types.ObjectId, ref: 'SmartMeter', required: true},
    title: String,
    message: String,
    type: {type: String, enum: ['info', 'error', 'warning', 'success'], default: 'info'}, //Type of notification
    read: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'notifications'})

const model = mongoose.model('Notification', notificationSchema)
module.exports = model
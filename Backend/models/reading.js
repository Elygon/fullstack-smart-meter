const mongoose = require('mongoose')
const Schema = mongoose.Schema

const readingSchema = new Schema({
    meter: {type: mongoose.Schema.Types.ObjectId, ref: 'SmartMeter', //Links to members model
            //required: true
        },
    timestamp: { type: Date, default: Date.now },
    energy_consumed: { type: Number, required: true},
    voltage: { type: Number, required: true },
    current: { type: Number, required: true },
    status: {type: String, enum: ['normal', 'warning', 'critical'], default: 'normal'},
}, {collection: 'readings'})

const model = mongoose.model('Reading', readingSchema)
module.exports = model
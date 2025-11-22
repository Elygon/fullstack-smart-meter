const mongoose = require('mongoose')
const Schema = mongoose.Schema

const smartMeterSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', //Links to members model
        //required: true
    },
    meter_id: {type: String}, //Unique identifier for internal use
    name: String,
    serialNumber: String,
    location: {type: String, required: true},
    description: String,
    status: {type: String, enum: ['active', 'inactive', 'faulty','disconnected', 'maintenance']
        , default: 'active'},
    installed_on: {type: Date, default: Date.now}
}, { timestamps: true, collection: 'smart_meters'})

const model = mongoose.model('SmartMeter', smartMeterSchema)
module.exports = model
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname : String, 
    email: String, 
    phone_no: String,
    password: String,
    gender: String,
    role: { type: String, enum: ['Admin'], default: 'Admin'},
    is_online:{type: Boolean, default: false },
    is_deleted: {type: Boolean, default: false},
    last_login: Number,
    last_logout: Number, 
    status: {type: String, enum: ["Active", "Suspended", "Deactivated"], default: "Active"},//Status can be 'Active', 'Suspended' or 'Deleted'
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    smartMeter: {type: mongoose.Schema.Types.ObjectId, ref: 'SmartMeter'},
}, {timestamps: true, collection: 'users'})

const model = mongoose.model('User', userSchema)
module.exports = model
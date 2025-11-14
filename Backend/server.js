const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })
const mongoose = require('mongoose')
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4885'], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database
mongoose.connect(process.env.MONGO_URI)
const con = mongoose.connection
con.on('open', () => console.log("Connected to Database"))
con.on('error', (err) => console.log("Database error:", err))

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)
})

// Routes (pass io if needed for emitting)
app.use('/auth', require('./routes/auth'))
app.use('/meter', require('./routes/meter'))
app.use('/reading', require('./routes/reading')(io)) // <- adjust reading route to receive io
app.use('/notification', require('./routes/notification'))

// Start server
const port = process.env.PORT || 4885
server.listen(port, () => console.log(`Server listening on port ${port} with WebSocket support`))

module.exports = { app, io }
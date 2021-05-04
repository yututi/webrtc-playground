const express = require('express')
const app = express()
const cors = require('cors')
const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000

const rooms = []

app.use(cors())
app.use(express.json())

app.get("/api/rooms", (req, res) => {
    console.log("get rooms")
    res.status(200).json(rooms)
})

const server = app.listen(PORT, function () {
    console.log('server listening. Port:' + PORT);
})

const socOptions = {}
if (dev) {
    socOptions.cors = {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
}

const io = require('socket.io')(server, socOptions);

io.on('connection', (socket) => {
    console.log('id: ' + socket.id + ' is connected')
    io.to(socket.id).emit("add-room", rooms)

    socket.on("add-room", (room) => {
        rooms.push(room.name)
        socket.join(room.name)
        io.emit("room-added", room)
    })

    socket.on("remove-room", name => {
        io.emit("room-removed", name)
        socket.rooms.delete(name)
        rooms.splice(rooms.indexOf(name), 1)
    })

    socket.on("join-room", name => {
        if (!rooms.some(room => room === name)) {
            rooms.push(name)
        }
        const sids = io.sockets.adapter.rooms.get(name) || []
        socket.join(name)
        socket.to(socket.id).emit("room-joined", sids)
    })

    socket.on("leave-room", name => {
        socket.broadcast.to(name).emit("member-leaved", socket.id)
        socket.leave(name)
    })

    socket.on("offer", offer => {
        socket.to(offer.to).emit("offer", offer)
    })
    socket.on("answer", answer => {
        socket.to(answer.to).emit("answer", answer)
    })

    socket.on("disconnect", () => {
        socket.broadcast.to(Array.from(socket.rooms)).emit("member-leaved", socket.id)
    })
})

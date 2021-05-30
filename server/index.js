const express = require('express')
const app = express()
const cors = require('cors')
const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000

// デフォルト以外のRoom
const rooms = []
const userId2Name = {}

// middleware conf
app.use(cors())
app.use(express.json())


// api conf
app.get("/api/rooms", (req, res) => {
    console.log(rooms)
    res.status(200).json(rooms.map(roomName => {
        return {
            name: roomName,
            users: io.sockets.adapter.rooms.get(roomName)?.size || 0
        }
    }))
})

const server = app.listen(PORT, function () {
    console.log('server listening. Port:' + PORT);
})

// socket io conf
const socOptions = {}
if (dev) {
    socOptions.cors = {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
}
const { Server } = require('socket.io')

const io = new Server(server, socOptions);

io.on('connection', (socket) => {
    console.log('id: ' + socket.id + ' is connected')

    socket.on("set-name", name => {
        userId2Name[socket.id] = name
    })

    socket.on("add-room", (name) => {
        console.log("add-room")
        if (!rooms.includes(name)) rooms.push(name)
        io.emit("room-added", name)
    })

    socket.on("remove-room", name => {
        if (rooms.includes(room)) rooms.splice(rooms.indexOf(room), 1)
        io.emit("room-removed", name)
    })

    socket.on("join-room", name => {
        const sids = Array.from(io.sockets.adapter.rooms.get(name) || [])
        if (!rooms.includes(name)) rooms.push(name)
        socket.join(name)
        io.to(socket.id).emit("room-joined", sids)
        io.emit("member-joined", {
            room: name,
            user: socket.id
        })
    })

    socket.on("leave-room", name => {
        socket.leave(name)
    })

    socket.on("offer", offer => {
        console.log("offer", offer)
        socket.to(offer.to).emit("offer", offer)
    })
    socket.on("answer", answer => {
        console.log("answer", answer)
        socket.to(answer.to).emit("answer", answer)
    })

    socket.on("candidate", candidateInfo => {
        console.log("candidate", candidateInfo)
        socket.to(candidateInfo.to).emit("candidate", candidateInfo)
    })

    socket.on("disconnect", () => {
        console.log('id: ' + socket.id + ' is disconnected')
        delete userId2Name[socket.id]
    })
})

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has leaved room ${room}`);
    if (!rooms.includes(room)) return
    io.emit("member-leaved", {
        room: room,
        user: id
    })
})

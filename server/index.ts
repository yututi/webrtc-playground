import * as express from "express"
import * as cors from "cors"
import { Socket, Server, ServerOptions } from "socket.io"
import { Room, User } from "./types"
import {
  createRoom,
  createUser,
  deleteRoom,
  getUserById,
  joinRoom,
  leaveRoom,
  listRoom,
  removeUser,
  getRoomById
} from "./repo"

const app = express()
const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000

// middleware conf
app.use(cors())
app.use(express.json())

// rest api

// list rooms
app.get("/api/rooms", (req, res) => {
  const rooms = listRoom()
  console.log(rooms)
  const roomIdToUserId = io.of("/").adapter.rooms
  res.status(200).json(rooms.map(room => {
    return {
      ...room,
      numberOfPeople: roomIdToUserId.get(room.id)?.size
    }
  }))
})

// list users in specific room
app.get("/api/rooms/:roomId/users", (req, res) => {
  const users = Array.from(io.of("/").adapter.rooms.get(req.params.roomId))?.map(userId => {
    return getUserById(userId)
  })
  if (!users) {
    return res.status(404).json({
      message: `Room not found. room id: ${req.params.roomId}`
    })
  }
  const room = getRoomById(req.params.roomId)
  res.status(200).json({
    room: room,
    users
  })
})

// delete room
app.delete("/api/rooms/:roomId", (req, res) => {
  const roomId = req.params.roomId
  deleteRoom(roomId)
  io.of("/").adapter.rooms.delete(roomId)
  res.status(200)
})

// create new Room
app.post("/api/newRoomByName/:roomName", (req, res) => {
  console.log("req.params.roomName", req.params.roomName)
  const room = createRoom(req.params.roomName)
  io.emit("room-added", room)
  res.status(200).json(room)
})

const server = app.listen(PORT, function () {
  console.log('server listening. Port:' + PORT);
})

// socket io conf
const socOptions: Partial<ServerOptions> = {}
if (dev) {
  socOptions.cors = {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
}

const io = new Server(server, socOptions);

io.on('connection', (socket) => {
  console.log('id: ' + socket.id + ' is connected')
  createUser(socket.id, socket.handshake.query.userName as string)

  socket.on("join-room", roomId => {

    const room = getRoomById(roomId)
    if (!room) return

    joinRoom(roomId, socket.id)

    socket.join(roomId)

    // すでに部屋にいるユーザのidを返す
    const sids = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

    const users = sids.map(id => getUserById(id))

    io.to(socket.id).emit("room-joined", users)
  })

  socket.on("leave-room", name => {
    console.log("leave-room", name)
    socket.leave(name)
  })

  // p2p
  socket.on("offer", offer => {
    socket.to(offer.to).emit("offer", offer)
  })
  socket.on("answer", answer => {
    socket.to(answer.to).emit("answer", answer)
  })
  socket.on("candidate", candidateInfo => {
    socket.to(candidateInfo.to).emit("candidate", candidateInfo)
  })

  socket.on("disconnect", () => {
    console.log('id: ' + socket.id + ' is disconnected')
    removeUser(socket.id)
  })
})

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});
io.of("/").adapter.on("delete-room", (roomId) => {
  io.emit("room-deleted", roomId)
  console.log(`room ${roomId} was deleted`);
});
io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
  if (room !== id) {
    io.emit("member-joined", {
      room: room,
      user: id
    })
  }
});
io.of("/").adapter.on("leave-room", (room, id) => {
  console.log(`socket ${id} has leaved room ${room}`);
  if (room !== id) {
    io.emit("member-leaved", {
      room: room,
      user: id
    })
  }
})

import * as express from "express"
import * as cors from "cors"
import { Server, ServerOptions } from "socket.io"
import userRepo from "./repo/user"
import roomRepo from "./repo/room"
import { UserStateChangedEvent, UserAndRoom, Room } from "../types"

const app = express()
const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000

// middleware conf
app.use(cors())
app.use(express.json())

// rest api

// list rooms
app.get("/api/rooms", (req, res) => {
  const rooms = roomRepo.listRooms()
  const users = userRepo.listUsers()
  console.log(rooms)
  res.status(200).json({
    rooms,
    users
  } as UserAndRoom)
})

// list users in specific room
// app.get("/api/rooms/:roomId/users", (req, res) => {
//   const users = Array.from(io.of("/").adapter.rooms.get(req.params.roomId))?.map(userId => {
//     return getUserById(userId)
//   })
//   if (!users) {
//     return res.status(404).json({
//       message: `Room not found. room id: ${req.params.roomId}`
//     })
//   }
//   const room = getRoomById(req.params.roomId)
//   res.status(200).json({
//     room: room,
//     users
//   })
// })

// delete room
app.delete("/api/rooms/:roomId", (req, res) => {
  const roomId = req.params.roomId
  roomRepo.removeRoom(roomId)
  io.emit("room-deleted", roomId)
  res.status(200)
})

// create new Room
app.post("/api/newRoomByName/:roomName", (req, res) => {
  console.log("req.params.roomName", req.params.roomName)
  const room = roomRepo.createRoom(req.params.roomName)
  io.emit("room-added", room as Room)
  res.status(200).json(room)
})

const server = app.listen(PORT, function () {
  console.log('server listening. Port:' + PORT);
})

// socket io conf
const socOptions: Partial<ServerOptions> = {
  path: "/soc/"
}
if (dev) {
  socOptions.cors = {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
}

const io = new Server(server, socOptions);

io.on('connection', (socket) => {
  console.log(`id:${socket.id}, name:${socket.handshake.query.userName} connected.`)

  userRepo.addUser({
    id: socket.id,
    name: socket.handshake.query.userName as string
  })
  io.emit("user-state-changed", {
    type: "create",
    user: userRepo.getUserById(socket.id)
  } as UserStateChangedEvent)

  socket.on("join-room", roomId => {

    const room = roomRepo.getRoomById(roomId)
    if (!room) {

      return
    }

    socket.join(roomId)

    // すでに部屋にいるユーザのidを返す
    const sids = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

    const users = sids.map(id => userRepo.getUserById(id))

    io.to(socket.id).emit("room-joined", users)
  })

  socket.on("leave-room", name => {
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
    io.emit("user-state-changed", {
      type: "delete",
      user: userRepo.getUserById(socket.id)
    } as UserStateChangedEvent)
    userRepo.removeUser(socket.id)
  })
})

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});
io.of("/").adapter.on("delete-room", (roomId) => {
  console.log(`room ${roomId} was deleted`);
});

// 入室時
io.of("/").adapter.on("join-room", (room, id) => {
  if (room !== id) {
    console.log(`socket ${id} has joined room ${room}`);


    roomRepo.joinRoom(room, id)

    io.to(room).emit("member-joined", {
      room: room,
      user: id
    })

    io.emit("user-state-changed", {
      type: "update",
      user: userRepo.getUserById(id)
    } as UserStateChangedEvent)
  }
});
// 退出時
io.of("/").adapter.on("leave-room", (room, id) => {
  if (room !== id) {
    console.log(`socket ${id} has leaved room ${room}`);


    roomRepo.leaveRoom(room, id)

    io.to(room).emit("member-leaved", {
      room: room,
      user: id
    })

    io.emit("user-state-changed", {
      type: "update",
      user: userRepo.getUserById(id)
    } as UserStateChangedEvent)
  }
})

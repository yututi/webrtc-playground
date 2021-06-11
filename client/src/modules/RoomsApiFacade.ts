import { Socket } from "socket.io-client"
import { UserWithRoom } from "types"
import { get } from "utils"
import { Room } from "types"

type RoomEvent = (room: Room) => void
type MemberEvent = (room: UserWithRoom) => void

type RoomsArgs = {
  socket: Socket
  onRoomAdded: RoomEvent
  onRoomRemoved: RoomEvent
  onMemberJoined: MemberEvent
  onMemberLeaved: MemberEvent
}

export default class RoomsAPIFacade {

  private socket: Socket

  private events: { [key: string]: MemberEvent | RoomEvent }

  constructor({
    socket,
    onMemberJoined,
    onMemberLeaved,
    onRoomAdded,
    onRoomRemoved
  }: RoomsArgs) {

    get("api/rooms")
      .then(res => res.json())
      .then(rooms => {
        rooms.forEach((room: Room) => {
          onRoomAdded(room)
        })
      })

    this.events = {
      "room-added": onRoomAdded,
      "room-removed": onRoomRemoved,
      "member-joined": onMemberJoined,
      "member-leaved": onMemberLeaved
    }

    Object.entries(this.events).forEach(([name, handler]) => {
      socket.on(name, handler)
    })

    this.socket = socket
  }

  destroy() {
    Object.entries(this.events).forEach(([name, handler]) => {
      this.socket.off(name, handler)
    })
  }
}
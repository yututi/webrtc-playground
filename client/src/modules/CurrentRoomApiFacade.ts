import { Socket } from "socket.io-client"
import { OfferInfo } from "types"
import { Room } from "types"

type RoomJoinedEvent = (alreadyJoinedMemberIds: string[]) => void
type MemberLeavedEvent = (leavedMemberId: string) => void
type MemberJoinedEvent = (offer: OfferInfo) => void

type CurrentRoomArgs = {
  socket: Socket
  room: Room
  onRoomJoined: RoomJoinedEvent,
  onMemberLeaved: MemberLeavedEvent,
  onMemberJoined: MemberJoinedEvent
}

export default class CurrentRoomAPIFacade {

  private socket: Socket

  private events: { [key: string]: RoomJoinedEvent | MemberLeavedEvent | MemberJoinedEvent }

  private room :Room

  constructor({
    socket,
    room,
    onMemberJoined,
    onMemberLeaved,
    onRoomJoined
  }: CurrentRoomArgs
  ) {

    socket.emit("join-room", room.name)

    this.events = {
      "room-joined": onRoomJoined,
      "member-leaved": onMemberLeaved,
      "offer": onMemberJoined
    }

    Object.entries(this.events).forEach(([name, handler]) => {
      socket.on(name, handler)
    })

    this.room = room
    this.socket = socket
  }

  get roomName () {
    return this.room.name
  }

  destroy() {
    this.socket.emit("leave-room", this.roomName)
    Object.entries(this.events).forEach(([name, handler]) => {
      this.socket.off(name, handler)
    })
  }
}
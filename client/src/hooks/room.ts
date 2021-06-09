import { useEffect } from "react"
import { useSocket } from "./socket"
import { get } from "utils"
import { Room, UserWithRoom } from "types"

type RoomAddedEvent = (room: Room[]) => void
type RoomRemovedEvenet = (room: Room) => void
type MemberJoinedEvent = (room: UserWithRoom) => void
type MemberLeavedEvent = (room: UserWithRoom) => void

type UseRoomsArgs = {
  onRoomAdded: RoomAddedEvent
  onRoomRemoved: RoomRemovedEvenet
  onMemberJoined: MemberJoinedEvent
  onMemberLeaved: MemberLeavedEvent
}

export const useRooms = ({
  onRoomAdded,
  onRoomRemoved,
  onMemberJoined,
  onMemberLeaved
}: UseRoomsArgs) => {

  const { socket } = useSocket()

  useEffect(() => {
    get("api/rooms")
      .then(res => res.json())
      // .then(res => { // peek
      //   console.log(res)
      //   return res
      // })
      .then(rooms => rooms.forEach(room => onRoomAdded(room))) // FIXME
  }, [onRoomAdded])

  useEffect(() => {

    const events = {
      "room-added": onRoomAdded,
      "room-removed": onRoomRemoved,
      "member-joined": onMemberJoined,
      "member-leaved": onMemberLeaved
    }

    Object.entries(events).forEach(([name, handler]) => {
      socket.on(name, handler)
    })

    return () => {
      Object.entries(events).forEach(([name, handler]) => {
        socket.off(name, handler)
      })
    }

  }, [socket, onRoomAdded, onRoomRemoved, onMemberJoined, onMemberLeaved])
}
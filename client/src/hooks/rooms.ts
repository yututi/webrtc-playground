import { useEffect, useRef } from "react"
import { useSocket } from "./socket"
import { get } from "utils"
import { Room, UserWithRoom } from "types"

type RoomAddedEvent = (room: Room) => void
type RoomRemovedEvenet = (room: Room) => void
type MemberJoinedEvent = (room: UserWithRoom) => void
type MemberLeavedEvent = (room: UserWithRoom) => void

type UseRoomsArgs = {
  onRoomAdded: RoomAddedEvent
  onRoomRemoved: RoomRemovedEvenet
  onMemberJoined: MemberJoinedEvent
  onMemberLeaved: MemberLeavedEvent
}

export default function useRooms(args: UseRoomsArgs) {

  const { socket } = useSocket()

  const eventsRef = useRef<UseRoomsArgs>()
  eventsRef.current = args

  useEffect(() => {
    get("api/rooms")
      .then(res => res.json())
      .then(rooms => rooms.forEach(room => eventsRef.current.onRoomAdded(room))) // FIXME
  }, [])

  useEffect(() => {

    const onRoomAdded: RoomAddedEvent = room => {
      eventsRef.current.onRoomAdded(room)
    }
    const onRoomRemoved: RoomRemovedEvenet = room => {
      eventsRef.current.onRoomRemoved(room)
    }
    const onMemberJoined: MemberJoinedEvent = user => {
      eventsRef.current.onMemberJoined(user)
    }
    const onMemberLeaved: MemberLeavedEvent = user => {
      eventsRef.current.onMemberLeaved(user)
    }

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

  }, [socket])
}
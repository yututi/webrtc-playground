import { useEffect, useRef } from "react"
import { useSocket } from "./socket"
import { getRooms } from "api"
import { Room, UserWithRoom } from "types"

type RoomEvent = (room: Room) => void
type RoomsEvent = (room: Room[]) => void
type MemberEvent = (room: UserWithRoom) => void

type UseRoomsArgs = {
  onRooms: RoomsEvent
  onRoomAdded: RoomEvent
  onRoomRemoved: RoomEvent
  onMemberJoined: MemberEvent
  onMemberLeaved: MemberEvent
}

export default function useRooms(args: UseRoomsArgs) {

  const socket = useSocket()

  console.log({socket})

  const eventsRef = useRef<UseRoomsArgs>()
  eventsRef.current = args

  useEffect(() => {
    getRooms().then(rooms => eventsRef.current.onRooms(rooms)) // FIXME
  }, [])

  useEffect(() => {
    if (!socket) return

    const onRoomAdded: RoomEvent = room => {
      eventsRef.current.onRoomAdded(room)
    }
    const onRoomRemoved: RoomEvent = room => {
      eventsRef.current.onRoomRemoved(room)
    }
    const onMemberJoined: MemberEvent = user => {
      eventsRef.current.onMemberJoined(user)
    }
    const onMemberLeaved: MemberEvent = user => {
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
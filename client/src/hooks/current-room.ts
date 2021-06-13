// import firebase, { store } from "modules/firebase"
import { useEffect, useRef } from "react"
import { useSocket } from "./socket"
import { User } from "types"

type OfferInfo = {
  from: string
  offer?: RTCSessionDescriptionInit
  name: string
}
type RoomJoinedEvent = (alreadyJoinedMembers: User[]) => void
type RoomLeavedEvent = () => void
type MemberLeavedEvent = (leavedMemberId: string) => void
type MemberJoinedEvent = (offer: OfferInfo) => void

type UseRoomArgs = {
  roomId: string
  onRoomJoined: RoomJoinedEvent,
  onMemberLeaved: MemberLeavedEvent,
  onMemberJoined: MemberJoinedEvent,
  onRoomLeaved: RoomLeavedEvent
}

const useCurrentRoom = ({ roomId, ...args }: UseRoomArgs) => {

  const socket = useSocket()

  const eventsArgs = useRef<{
    onRoomJoined: RoomJoinedEvent,
    onMemberLeaved: MemberLeavedEvent,
    onMemberJoined: MemberJoinedEvent
  }>(null)
  eventsArgs.current = args

  useEffect(() => {
    if (!roomId || !socket) return

    socket.emit("join-room", roomId)

    const onMemberJoined: MemberJoinedEvent = (offer) => {
      eventsArgs.current.onMemberJoined(offer)
    }
    const onMemberLeaved: MemberLeavedEvent = (userId) => {
      eventsArgs.current.onMemberLeaved(userId)
    }
    const onRoomJoined: RoomJoinedEvent = (users) => {
      eventsArgs.current.onRoomJoined(users)
    }

    const events = {
      "room-joined": onRoomJoined,
      "member-leaved": onMemberLeaved,
      "offer": onMemberJoined
    }

    Object.entries(events).forEach(([name, handler]) => {
      socket.on(name, handler)
    })

    return () => {
      Object.entries(events).forEach(([name, handler]) => {
        socket.off(name, handler)
      })
      socket.emit("leave-room", roomId)
    }
  }, [roomId, socket])
}

export default useCurrentRoom
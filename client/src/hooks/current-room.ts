// import firebase, { store } from "modules/firebase"
import { useEffect } from "react"
import { useSocket } from "./socket"
import { User } from "types"
import { useAppDispatch } from "redux/hooks"
import {
  addUser,
  removeUserById,
  setUsersWithoutMyOwn,
  leaveRoomById,
  setCurrentRoomById
} from "redux/slices/current-room"

type OfferInfo = {
  from: string
  offer?: RTCSessionDescriptionInit
  name: string
}
type RoomJoinedEvent = (alreadyJoinedMembers: User[]) => void
type MemberLeavedEvent = (leavedMemberId: string) => void
type MemberJoinedEvent = (offer: OfferInfo) => void

const useCurrentRoomSyncronizer = (roomId: string) => {

  const socket = useSocket()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!roomId || !socket) return

    dispatch(setCurrentRoomById(roomId))

    socket.emit("join-room", roomId)

    const onMemberJoined: MemberJoinedEvent = (offer) => {
      dispatch(addUser({
        id: offer.from,
        name: offer.name,
        offer: offer.offer
      }))
    }
    const onMemberLeaved: MemberLeavedEvent = (userId) => {
      dispatch(removeUserById(userId))
    }
    const onRoomJoined: RoomJoinedEvent = (users) => {
      dispatch(setUsersWithoutMyOwn(users))
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
      dispatch(leaveRoomById(roomId))
    }
  }, [dispatch, roomId, socket])
}

export default useCurrentRoomSyncronizer
import { useEffect } from "react"
import { useSocket } from "./socket"
import { getRooms } from "api"
import { Room, UserStateChangedEvent } from "types"
import { useAppDispatch } from "redux/hooks"
import {
  addUser,
  addRoom,
  removeUser,
  removeRoom,
  setRooms,
  updateUserState,
  setUsers
} from "redux/slices/rooms"

type RoomEvent = (room: Room) => void
type MemberEvent = (room: UserStateChangedEvent) => void

export default function useRoomsSyncronizer() {

  const socket = useSocket()

  const dispatch = useAppDispatch()

  useEffect(() => {
    // socketが無ければ同期できないのでまだfetchしない
    if (!socket) return

    getRooms().then(data => {
      dispatch(setRooms(data.rooms))
      dispatch(setUsers(data.users))
    })

    return () => {
      dispatch(setRooms([]))
      dispatch(setUsers([]))
    }
  }, [dispatch, socket])

  useEffect(() => {
    if (!socket) return

    const onRoomAdded: RoomEvent = room => {
      dispatch(addRoom(room))
    }
    const onRoomRemoved: RoomEvent = room => {
      dispatch(removeRoom(room.id))
    }
    const onMemberJoined: MemberEvent = e => {
      switch (e.type) {
        case "create": {
          return dispatch(addUser(e.user))
        }
        case "delete": {
          return dispatch(removeUser(e.user.id))
        }
        case "update": {
          return dispatch(updateUserState(e.user))
        }
      }
    }

    const onReconnect = () => {
      getRooms().then(data => {
        dispatch(setRooms(data.rooms))
        dispatch(setUsers(data.users))
      })
    }

    const events = {
      "room-added": onRoomAdded,
      "room-removed": onRoomRemoved,
      "user-state-changed": onMemberJoined,
      "reconnect": onReconnect
    }

    Object.entries(events).forEach(([name, handler]) => {
      socket.on(name, handler)
    })

    return () => {
      Object.entries(events).forEach(([name, handler]) => {
        socket.off(name, handler)
      })
    }

  }, [dispatch, socket])
}
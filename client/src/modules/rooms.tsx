import { createContext, useEffect, useState, useContext, useCallback, useRef } from "react"
import { Room } from "./types"
import { useSocket } from "./socket"
import { get } from "utils"


type RoomsState = {
    rooms: Room[]
    addRoom: (room: string) => void
    removeRoom: (roomId: string) => void
}

const RoomsContext = createContext<RoomsState>({
    rooms: [],
    addRoom: () => { throw new Error("not initialized.") },
    removeRoom: () => { throw new Error("not initialized.") }
})


export const RoomsProvider: React.FC = ({ children }) => {

    const { socket } = useSocket()
    const [rooms, setRooms] = useState<Room[]>([])
    const roomsRef = useRef<Room[]>([])
    roomsRef.current = rooms

    useEffect(() => {
        get("api/rooms")
            .then(res => res.json())
            .then(res => {
                console.log(res)
                return res
            })
            .then(rooms => setRooms(rooms))
    }, [])

    useEffect(() => {

        const onRoomAdded = (data) => {
            console.log("room-added", data)
            console.log("rooms", rooms)
            setRooms([...roomsRef.current, { name: data, users: 0 }])
        }

        const onRoomRemoved = (data) => {
            setRooms(roomsRef.current.filter(room => room.name === data))
        }

        const onMemberJoined = (data) => {
            console.log("member-joined", data)
            const room = roomsRef.current.find(room => room.name === data.room)
            if (room) {
                room.users++
                setRooms([...roomsRef.current])
            }
        }

        const onMemberLeaved = (data) => {
            console.log("member-leaved", data)
            const room = roomsRef.current.find(room => room.name === data.room)
            if (room) {
                room.users--
                setRooms([...roomsRef.current])
            }
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

    const addRoom = useCallback((room: string) => {
        console.log("add-room")
        socket.emit("add-room", room)
    }, [socket])

    const removeRoom = useCallback((roomId: string) => {
        socket.emit("remove-room", roomId)
    }, [socket])

    const value = {
        rooms,
        addRoom,
        removeRoom
    }
    return <RoomsContext.Provider value={value}> {children} </RoomsContext.Provider>
}

export const useRoomsContext = () => {
    return useContext(RoomsContext)
}
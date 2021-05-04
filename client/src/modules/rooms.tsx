import { createContext, useEffect, useState, useContext, useCallback } from "react"
import { Room } from "./types"
import { useSocket } from "./socket"
import { get } from "utils"


type RoomsState = {
    rooms: Room[]
    addRoom: (room: Room) => void
    removeRoom: (roomId: string) => void
}

const RoomsContext = createContext<RoomsState>({
    rooms: [],
    addRoom: () => { throw new Error("not initialized.") },
    removeRoom: () => { throw new Error("not initialized.") }
})


export const RoomsProvider: React.FC = ({ children }) => {

    const { socket, isConnected } = useSocket()
    const [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        get("api/rooms")
            .then(res => res.json())
            .then(rooms => setRooms(rooms))
    }, [])

    useEffect(() => {
        console.log("isConnected", isConnected)
        if (!isConnected) return

        const onRoomAdded = (data) => {
            setRooms([...rooms, data])
        }

        const onRoomRemoved = (data) => {
            setRooms(rooms.filter(room => room.id === data))
        }

        const events = {
            "room-added": onRoomAdded,
            "room-removed": onRoomRemoved
        }

        Object.entries(events).forEach(([name, handler]) => {
            socket.on(name, handler)
        })

        return () => {
            Object.entries(events).forEach(([name, handler]) => {
                socket.off(name, handler)
            })
        }
    }, [isConnected])

    const addRoom = useCallback((room: Room) => {
        socket.emit("add-room", room)
    }, [])

    const removeRoom = useCallback((roomId: string) => {
        socket.emit("remove-room", roomId)
    }, [])

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
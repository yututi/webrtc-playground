// import firebase, { store } from "modules/firebase"
import { createContext, useEffect, useState, useContext, useMemo } from "react"
import { Room, User } from "./types"
import { useSocket } from "./socket"

type RoomState = {
    isJoined: boolean
    room: Room
    setRoom: (room: Room) => void
    users: User[]
    addUserWithOffer: (user: User) => void // これの用途思い出せない
}

const RoomContext = createContext<RoomState>({
    isJoined: false,
    room: null,
    setRoom: () => { },
    users: [],
    addUserWithOffer: () => { }
})


export const RoomProvider: React.FC = ({ children }) => {

    const { socket } = useSocket()

    const [room, setRoom] = useState<Room>(null)

    const [isJoined, setIsJoined] = useState(false)

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if (!room) return

        socket.emit("join-room", room.name)

        const onRoomJoined = alreadyJoinedMemberIds => {
            console.log("alreadyJoinedMemberIds", alreadyJoinedMemberIds)
            setIsJoined(true)
            setUsers([...users, ...alreadyJoinedMemberIds
                // .filter(member => member.id !== socket.id)
                .map(id => {
                    return {
                        id
                    }
                })])
        }

        const onMemberLeaved = leavedMemberId => {
            setUsers(users.filter(user => user.id !== leavedMemberId))
        }

        const onMemberJoined = offerInfo => {
            console.log("offerInfo", offerInfo)
            setUsers([...users, {
                id: offerInfo.from,
                offer: offerInfo.offer,
                name: offerInfo.name
            }])
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
            socket.emit("leave-room", {
                room: room.name,
            })
        }
    }, [room])

    const addUserWithOffer = (user: User) => {
        setUsers([...users, user])
    }

    const value = {
        isJoined,
        room,
        setRoom,
        users,
        addUserWithOffer
    }

    return <RoomContext.Provider value={value}> {children} </RoomContext.Provider>
}

export const useRoomContext = () => {
    return useContext(RoomContext)
}
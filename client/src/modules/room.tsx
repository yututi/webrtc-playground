// import firebase, { store } from "modules/firebase"
import { createContext, useEffect, useState, useContext, useMemo } from "react"
import { Room, User } from "./types"
import { useSocket } from "./socket"

type RoomState = {
    isJoined: boolean
    room: Room
    users: User[]
    addUserWithOffer: (user: User) => void
}

const RoomContext = createContext<RoomState>({
    isJoined: false,
    room: null,
    users: [],
    addUserWithOffer: () => { }
})

type Props = {
    room: Room
}

export const RoomProvider: React.FC<Props> = ({ room, children }) => {

    const { socket, isConnected } = useSocket()

    const [isJoined, setIsJoined] = useState(false)

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if (!isConnected) return

        socket.emit("join-room", room)

        const onRoomJoined = alreadyJoinedMemberInfos => {
            setIsJoined(true)
            setUsers([...users, ...alreadyJoinedMemberInfos.map(member => {
                return {
                    id: member.id,
                    name: member.name
                }
            })])
        }

        const onMemberLeaved = leavedMemberId => {
            setUsers(users.filter(user => user.id !== leavedMemberId))
        }

        const onMemberJoined = offerInfo => {
            setUsers([...users, offerInfo])
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
        }
    }, [room, isConnected])

    const addUserWithOffer = (user: User) => {
        setUsers([...users, user])
    }

    const value = {
        isJoined,
        room,
        users,
        addUserWithOffer
    }

    return <RoomContext.Provider value={value}> {children} </RoomContext.Provider>
}

export const useRoomContext = () => {
    return useContext(RoomContext)
}
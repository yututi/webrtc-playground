import React, { createContext, useEffect, useState, useContext, useMemo } from "react"
import { User } from "./types"
import { useSocket } from "./socket"
import { useRoomContext } from "./room"
import { useMeContext } from "./me"


type UserState = {
    name: string
    isConnected: boolean
    stream: MediaStream
}

type CandidateInfo = {
    from: string
    candidate: string
}
type AnswerInfo = {
    from: string
    name: string
    description: RTCSessionDescriptionInit
}

const UserContext = createContext<UserState>({
    isConnected: false,
    name: "",
    stream: null
})

type Props = {
    user: User
}

export const UserProvider: React.FC<Props> = ({ user, children }) => {

    const connection = useMemo(() => new RTCPeerConnection({/* conf */ }), [user.id])

    // streamじゃなくてref?
    const stream = useMemo(() => new MediaStream(), [user.id])

    const [isRtcConnected, setIsRtcConnected] = useState(false)

    const [name, setName] = useState("-")

    const { socket, isConnected } = useSocket()

    const { name: myName } = useMeContext()

    useEffect(() => {
        if (!isConnected) return

        console.log("peer created.", user.id)

        const socketEvents: { [key: string]: (...args: any[]) => void } = {}

        // 経路候補の交換
        const sendCandidate = () => {
            connection.onicecandidate = event => {
                if (!event.candidate) return
                socket.emit("candidate", {
                    to: user.id,
                    from: socket.id,
                    candidate: JSON.stringify(event.candidate)
                })
            }
        }

        socketEvents.candidate = (candidateInfo: CandidateInfo) => {
            if (candidateInfo.from === user.id) {
                connection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
            }
        }


        // RTCの作成
        if (user.offer) {
            connection.setRemoteDescription(user.offer)
                .then(() => connection.createAnswer())
                .then(answer => {
                    connection.setLocalDescription(answer)
                    socket.emit("answer", {
                        to: user.id,
                        from: socket.id,
                        name: myName,
                        answer: answer
                    })
                    sendCandidate()
                })
        } else {
            connection.createOffer().then(offer => {
                connection.setLocalDescription(offer)
                socket.emit("offer", {
                    to: user.id,
                    from: socket.id,
                    name: myName,
                    offer: offer
                })
            })
            socketEvents.answer = (answerInfo: AnswerInfo) => {
                if (user.id === answerInfo.from) {
                    connection.setRemoteDescription(answerInfo.description)
                    sendCandidate()
                    setName(answerInfo.name)
                }
            }
        }

        connection.addEventListener("connectionstatechange", () => {
            setIsRtcConnected(connection.connectionState === "connected")
        })

        Object.entries(socketEvents).forEach(([name, handler]) => {
            socket.on(name, handler)
        })

        return () => {
            connection.close()

            Object.entries(socketEvents).forEach(([name, handler]) => {
                socket.off(name, handler)
            })
        }
    }, [user.id])

    const value = {
        isConnected: isRtcConnected,
        name,
        stream
    }

    return <UserContext.Provider value={value}> {children} </UserContext.Provider>
}

export const useUserContext = () => {
    return useContext(UserContext)
}
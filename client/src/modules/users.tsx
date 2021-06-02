import React, { createContext, useEffect, useState, useContext, useMemo } from "react"
import { User } from "./types"
import { useSocket } from "./socket"
import { useMeContext } from "./me"
import { useDeviceContext } from "./devices"
import { useCurrentDeviceContext } from "./current-device"
import { P2PVideo } from "./P2PVideo"


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
    answer: RTCSessionDescriptionInit
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

    // TODO useReducerへの置き換え

    const [isRtcConnected, setIsRtcConnected] = useState(false)

    const [name, setName] = useState("-")

    const { socket } = useSocket()

    const { name: myName } = useMeContext()

    const p2p = useMemo(() => new P2PVideo(300, 500), [user.id, socket])
    // const connection = useMemo(() => new RTCPeerConnection({ 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }), [user.id, socket])

    useEffect(() => {

        console.log("peer created.", user.id)

        const socketEvents: { [key: string]: (...args: any[]) => void } = {}

        p2p.onIceCandidate(candidate => {
            socket.emit("candidate", {
                to: user.id,
                from: socket.id,
                candidate: JSON.stringify(candidate)
            })
        })

        socketEvents.candidate = (candidateInfo: CandidateInfo) => {
            console.log("receive candidate", candidateInfo)
            if (candidateInfo.from === user.id) {
                // connection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
                p2p.addCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
            }
        }

        // RTCの作成
        if (user.offer) {
            p2p.setOfferAndGetAnswer(user.offer).then(answer => {
                socket.emit("answer", {
                    to: user.id,
                    from: socket.id,
                    name: myName,
                    answer: answer
                })
            })
            setName(user.name)
        } else {

            p2p.createOffer().then(offer => {
                socket.emit("offer", {
                    to: user.id,
                    from: socket.id,
                    name: myName,
                    offer: offer
                })
            })

            socketEvents.answer = (answerInfo: AnswerInfo) => {
                console.log("answerInfo", answerInfo, user)
                if (user.id === answerInfo.from) {
                    console.log("answered", user.id)
                    p2p.setAnswer(new RTCSessionDescription(answerInfo.answer))
                    setName(answerInfo.name)
                }
            }
        }

        Object.entries(socketEvents).forEach(([name, handler]) => {
            socket.on(name, handler)
        })

        return () => {
            p2p.destroy()

            Object.entries(socketEvents).forEach(([name, handler]) => {
                socket.off(name, handler)
            })
        }
    }, [user.id, socket])

    const { camera, audioIn } = useCurrentDeviceContext()

    useEffect(() => {
        p2p.setDevice({ videoDeviceId: camera.deviceId, audioDeviceId: audioIn.deviceId })
    }, [camera, audioIn, user.id, p2p])

    const value = {
        isConnected: isRtcConnected,
        name,
        stream: p2p.stream
    }

    return <UserContext.Provider value={value}> {children} </UserContext.Provider>
}

export const useUserContext = () => {
    return useContext(UserContext)
}
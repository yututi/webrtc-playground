import React, { createContext, useEffect, useState, useContext, useMemo } from "react"
import { User } from "./types"
import { useSocket } from "./socket"
import { useMeContext } from "./me"
import { useDeviceContext } from "./devices"
import { useCurrentDeviceContext } from "./current-device"


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

    // streamじゃなくてref?
    const stream = useMemo(() => new MediaStream(), [])

    const [isRtcConnected, setIsRtcConnected] = useState(false)

    const [name, setName] = useState("-")

    const { socket } = useSocket()

    const { name: myName } = useMeContext()

    const connection = useMemo(() => new RTCPeerConnection({ 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }), [user.id, socket])

    useEffect(() => {

        console.log("peer created.", user.id)

        const socketEvents: { [key: string]: (...args: any[]) => void } = {}

        // 経路候補の交換
        connection.addEventListener("icecandidate", event => {
            console.log("candidate", event.candidate)
            if (!event.candidate) return
            console.log("send candidate")
            socket.emit("candidate", {
                to: user.id,
                from: socket.id,
                candidate: JSON.stringify(event.candidate)
            })
        })

        socketEvents.candidate = (candidateInfo: CandidateInfo) => {
            console.log("receive candidate", candidateInfo)
            if (candidateInfo.from === user.id) {
                connection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
            }
        }

        const addStreamToConnection = () => {
            return navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: camera.deviceId,
                    height: 300,
                    width: 400
                },
                audio: {
                    deviceId: audioIn.deviceId,
                    noiseSuppression: true,
                    echoCancellation: true
                }
            }).then(stream => {

                stream.getTracks().forEach(track => {
                    connection.addTrack(track)
                })
            })
        }

        // RTCの作成
        if (user.offer) {
            connection.setRemoteDescription(user.offer)
                .then(addStreamToConnection)
                .then(() => connection.createAnswer())
                .then(answer => {
                    connection.setLocalDescription(answer)
                    socket.emit("answer", {
                        to: user.id,
                        from: socket.id,
                        name: myName,
                        answer: answer
                    })
                })
            setName(user.name)
        } else {
            addStreamToConnection().then(() => {
                connection.createOffer().then(offer => {
                    connection.setLocalDescription(offer)
                    socket.emit("offer", {
                        to: user.id,
                        from: socket.id,
                        name: myName,
                        offer: offer
                    })
                })
            })

            socketEvents.answer = (answerInfo: AnswerInfo) => {
                console.log("answerInfo", answerInfo, user)
                if (user.id === answerInfo.from) {
                    console.log("answered", user.id)
                    connection.setRemoteDescription(new RTCSessionDescription(answerInfo.answer))
                    setName(answerInfo.name)
                }
            }
        }

        connection.addEventListener("connectionstatechange", () => {
            console.log("connection state chanhed.", connection.connectionState)
            setIsRtcConnected(connection.connectionState === "connected")
        })

        connection.addEventListener("track", e => {
            console.log("track added")
            stream.addTrack(e.track)
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
    }, [user.id, socket])

    const { camera, audioIn } = useCurrentDeviceContext()

    // useEffect(() => {

    //     const tracks = []

    //     navigator.mediaDevices.getUserMedia({
    //         video: {
    //             deviceId: camera.deviceId,
    //             height: 300,
    //             width: 400
    //         },
    //         audio: {
    //             deviceId: audioIn.deviceId,
    //             noiseSuppression: true,
    //             echoCancellation: true
    //         }
    //     }).then(stream => {

    //         stream.getAudioTracks().forEach(track => {
    //             tracks.push(track)
    //             connection.addTrack(track)
    //         })
    //     })

    //     return () => {
    //         if (connection.connectionState === "connected") {
    //             tracks.forEach(track => {
    //                 connection.removeTrack(track)
    //             })
    //         }
    //     }

    // }, [camera, audioIn])

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
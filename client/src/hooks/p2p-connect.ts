import React, { createContext, useEffect, useState, useContext, useMemo } from "react"
import { User, UserWithOffer, CandidateInfo, AnswerInfo } from "types"
import { useSocket } from "./socket"
import { P2PVideo } from "modules/P2PVideo"
import { VIDEO } from "modules/const"

export const useP2PConnect = (remoteUser: UserWithOffer, localUserName: string) => {

  const [remoteUserName, setName] = useState("-")

  const { socket } = useSocket()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const p2p = useMemo(() => new P2PVideo(VIDEO.HEIGHT, VIDEO.WIDTH), [remoteUser, socket, localUserName])

  useEffect(() => {

    console.log("peer created.", remoteUser.id)

    const socketEvents: { [key: string]: (...args: any[]) => void } = {}

    p2p.onIceCandidate(candidate => {
      socket.emit("candidate", {
        to: remoteUser.id,
        from: socket.id,
        candidate: JSON.stringify(candidate)
      })
    })

    socketEvents.candidate = (candidateInfo: CandidateInfo) => {
      console.log("receive candidate", candidateInfo)
      if (candidateInfo.from === remoteUser.id) {
        // connection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
        p2p.addCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
      }
    }

    // RTCの作成
    if (remoteUser.offer) {
      p2p.setOfferAndGetAnswer(remoteUser.offer).then(answer => {
        socket.emit("answer", {
          to: remoteUser.id,
          from: socket.id,
          name: localUserName,
          answer: answer
        })
      })
      setName(remoteUser.name)
    } else {

      p2p.createOffer().then(offer => {
        socket.emit("offer", {
          to: remoteUser.id,
          from: socket.id,
          name: localUserName,
          offer: offer
        })
      })

      socketEvents.answer = (answerInfo: AnswerInfo) => {
        console.log("answerInfo", answerInfo, remoteUser)
        if (remoteUser.id === answerInfo.from) {
          console.log("answered", remoteUser.id)
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
  }, [remoteUser, socket, p2p, localUserName])

  return {
    remoteUserName,
    p2p
  }
}

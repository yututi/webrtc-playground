import React, { createContext, useEffect, useState, useContext, useMemo } from "react"
import { User, UserWithOffer, CandidateInfo, AnswerInfo } from "types"
import { useSocket } from "./socket"
import { P2PVideo } from "modules/P2PVideo"
import { VIDEO } from "modules/const"
import P2PConnector from "modules/P2PConnector"

export const useP2PConnect = (remoteUser: UserWithOffer, localUserName: string) => {

  const [remoteUserName, setName] = useState("-")

  const { socket } = useSocket()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const p2p = useMemo(() => new P2PVideo(VIDEO.HEIGHT, VIDEO.WIDTH), [remoteUser, socket, localUserName])

  useEffect(() => {
    const connector = new P2PConnector({
      socket,
      p2p,
      localUserName,
      remoteUser,
      onRemoteUserNameChanged: setName
    })

    return () => {
      connector.destroy()
    }
  }, [remoteUser, socket, p2p, localUserName])

  return {
    remoteUserName,
    p2p
  }
}

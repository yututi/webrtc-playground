import { useEffect, useState } from "react"
import { UserWithOffer } from "types"
import { useSocket } from "./socket"
import { P2PVideo } from "modules/P2PVideo"
import { VIDEO } from "const"
import P2PConnector from "modules/P2PConnector"

export const useP2PConnect = (remoteUser: UserWithOffer, localUserName: string) => {

  const [remoteUserName, setName] = useState("-")
  const [stream, setStream] = useState<MediaStream>(null)

  const socket = useSocket()

  useEffect(() => {
    if(!socket) return

    const p2p = new P2PVideo(VIDEO.HEIGHT, VIDEO.WIDTH)

    const connector = new P2PConnector({
      socket,
      p2p,
      localUserName,
      remoteUser,
      onRemoteUserNameChanged: setName
    })

    setStream(p2p.stream)

    return () => {
      connector.destroy()
    }
  }, [remoteUser, socket, localUserName])

  return {
    remoteUserName,
    stream
  }
}

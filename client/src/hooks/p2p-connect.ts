import { useEffect, useState } from "react"
import { UserWithOffer } from "types"
import { useSocket } from "./socket"
import { P2P } from "modules/P2P"
import { VIDEO } from "const"
import P2PConnector from "modules/P2PConnector"
import { useAppSelector } from "redux/hooks"

// TODO リファクタ
export const useP2PConnect = (remoteUser: UserWithOffer, localUserName: string) => {

  const [p2p, setP2p] = useState<P2P>(null)

  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    const _p2p = new P2P(VIDEO.HEIGHT, VIDEO.WIDTH)

    const connector = new P2PConnector({
      socket,
      p2p: _p2p,
      localUserName,
      remoteUser,
      onRemoteUserNameChanged: () => { }
    })

    setP2p(_p2p)

    return () => {
      connector.destroy()
    }
  }, [remoteUser, socket, localUserName])

  const {
    audioInId,
    videoId,
    isVideoMute,
    isAudioMute
  } = useAppSelector(state => state.devices.current)

  useEffect(() => {
    if (!p2p) return

    p2p.audioMute = isAudioMute
    p2p.videoMute = isVideoMute
  }, [isVideoMute, isAudioMute, p2p])

  useEffect(() => {
    if (!p2p) return

    console.log({
      audioInId
    })

    p2p.setDevice({
      videoDeviceId: videoId,
      audioDeviceId: audioInId
    })
  }, [videoId, audioInId, p2p])

  return {
    p2p
  }
}

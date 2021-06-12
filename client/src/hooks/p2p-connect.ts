import { useEffect, useMemo, useState } from "react"
import { UserWithOffer } from "types"
import { useSocket } from "./socket"
import { P2PVideo } from "modules/P2PVideo"
import { VIDEO } from "const"
import P2PConnector from "modules/P2PConnector"
import { useAppSelector } from "redux/hooks"

// TODO リファクタ
export const useP2PConnect = (remoteUser: UserWithOffer, localUserName: string) => {

  const [stream, setStream] = useState<MediaStream>(null)

  const socket = useSocket()


  const p2p = useMemo(() => new P2PVideo(VIDEO.HEIGHT, VIDEO.WIDTH), [remoteUser, socket, localUserName])

  useEffect(() => {
    if (!socket) return

    const connector = new P2PConnector({
      socket,
      p2p,
      localUserName,
      remoteUser,
      onRemoteUserNameChanged: () => { }
    })

    setStream(p2p.stream)

    return () => {
      connector.destroy()
    }
  }, [remoteUser, socket, localUserName])

  const isVideoMute = useAppSelector(state => state.devices.isVideoMute)
  const isAudioMute = useAppSelector(state => state.devices.isAudioMute)

  const {
    currentAudioInId,
    currentVideoId
  } = useAppSelector(state => state.devices)

  useEffect(() => {
    p2p.audioMute = isAudioMute
    p2p.videoMute = isVideoMute
  }, [isVideoMute, isAudioMute])

  useEffect(() => {
    p2p.setDevice({
      videoDeviceId: currentVideoId,
      audioDeviceId: currentAudioInId
    })
  }, [currentAudioInId, currentVideoId])

  return {
    stream
  }
}

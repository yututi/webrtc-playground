import React, { useEffect, useRef, useState } from "react";
import "./user-video.scss"
import { UserWithOffer } from "types";
import { useP2PConnect } from "hooks/p2p-connect";
import { useAppSelector } from "redux/hooks";


type Props = {
  user: UserWithOffer
}

const User: React.VFC<Props> = ({ user }) => {

  const videoRef = useRef<HTMLVideoElement>(null)

  const localUserName = useAppSelector(state => state.global.userName)

  const [volume, setVolume] = useState(0.5)

  const {
    remoteUserName,
    stream
  } = useP2PConnect(
    user,
    localUserName,
  )

  useEffect(() => {
    videoRef.current.srcObject = stream
  }, [stream])

  useEffect(() => {
    videoRef.current.volume = volume
  }, [volume])

  return (
    <div className="user video">
      <div className="video__inner">
        <video
          className="user__video"
          ref={videoRef}
          autoPlay
        />
      </div>
      <div className="user__actions action-btns">
        <input type="range" min="0" max="1" step="0.1" onChange={e => setVolume(e.target.valueAsNumber)} />
      </div>
      <div className="user__name">
        {remoteUserName}
      </div>
    </div>
  )
}

export default User
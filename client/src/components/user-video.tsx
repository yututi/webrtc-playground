import React, { useCallback, useEffect, useRef, useState } from "react";
import "./user-video.scss"
import { UserWithOffer } from "types";
import { useP2PConnect } from "hooks/p2p-connect";
import { useAppSelector } from "redux/hooks";
import useMouseInOut from "hooks/mouse-in-out";
import IconBtn from "components/icon-btn"
import {
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons"

// リモートユーザのビデオ

type Props = {
  user: UserWithOffer
}

const User: React.VFC<Props> = ({ user }) => {

  const videoRef = useRef<HTMLVideoElement>(null)

  const localUserName = useAppSelector(state => state.global.userName)

  const [volume, setVolume] = useState(0.5)
  const [isMute, setIsMute] = useState(false)

  const {
    ref,
    isMouseIn
  } = useMouseInOut()

  const {
    p2p
  } = useP2PConnect(
    user,
    localUserName,
  )

  useEffect(() => {
    if(!p2p) return
    videoRef.current.srcObject = p2p.stream
  }, [p2p])

  useEffect(() => {
    videoRef.current.volume = isMute ? 0 : volume
  }, [volume, isMute])

  return (
    <div className="user video" ref={ref}>
      <div className="video__inner">
        <video
          className="user__video"
          ref={videoRef}
          autoPlay
        />
      </div>
      <div className="user__name">
        {user.name}
      </div>
      <UserActions
        show={isMouseIn}
        isMute={isMute}
        setIsMute={setIsMute}
        setVolume={setVolume}
      />
    </div>
  )
}

// ボリューム管理用

type UserActionProps = {
  show: boolean
  setVolume: (volume: number) => void
  isMute: boolean
  setIsMute: (isMute: boolean) => void
}

const UserActions: React.VFC<UserActionProps> = React.memo(({ show, setVolume, isMute, setIsMute }) => {

  const classes = [
    "user__actions action-btns",
    show && "user__actions--is-show"
  ].filter(Boolean).join(" ")

  const onClick = useCallback(() => { setIsMute(!isMute) }, [isMute, setIsMute])

  return (
    <div className={classes}>
      <IconBtn icon={isMute ? faVolumeMute : faVolumeUp} onClick={onClick} iconSize="lg" reverse></IconBtn>
      <input type="range" disabled={isMute} defaultValue="0.5" min="0" max="1" step="0.1" onChange={e => setVolume(e.target.valueAsNumber)} />
    </div>
  )
})

export default User
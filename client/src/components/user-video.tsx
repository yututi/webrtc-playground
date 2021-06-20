import React, { useCallback, useEffect, useRef, useState } from "react";
import { UserWithOffer } from "types";
import { useP2PConnect } from "hooks/p2p-connect";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import useMouseInOut from "hooks/mouse-in-out";
import IconBtn from "components/icon-btn"
import {
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons"

import "./user-video.scss"
import { addInfoMessage } from "redux/slices/messages";

// リモートユーザのビデオ

type Props = {
  user: UserWithOffer
}

const User: React.VFC<Props> = ({ user }) => {

  const videoRef = useRef<HTMLVideoElement>(null)

  const localUserName = useAppSelector(state => state.global.userName)

  const [volume, setVolume] = useState(0.5)
  const [isMute, setIsMute] = useState(false)

  const dispatch = useAppDispatch()

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

  const [isVideoActive, setIsVideoActive] = useState(false)

  useEffect(() => {
    if (!p2p) return

    const stream = p2p.stream

    const videoTrack = stream.getVideoTracks()[0]

    if (videoTrack) {
      setIsVideoActive(videoTrack.enabled)
      videoTrack.onmute = () => {
        setIsVideoActive(false)
      }
      videoTrack.onunmute = () => {
        setIsVideoActive(true)
      }
    } else {
      setIsVideoActive(false)
    }

    videoRef.current.srcObject = p2p.stream

  }, [p2p])

  useEffect(() => {
    videoRef.current.volume = isMute ? 0 : volume
  }, [volume, isMute])

  useEffect(() => {
    if (user.offer) {
      dispatch(addInfoMessage(`${user.name}が入室しました`))
    }
  }, [dispatch, user])

  const overlayClasses = [
    "video__overlay",
    isMouseIn && "video__overlay--is-show"
  ].filter(Boolean).join(" ")

  return (
    <div className="video user card card--is-primary" ref={ref}>
      <div className="video__inner">
        <video
          className="user__video"
          ref={videoRef}
          autoPlay
          playsInline
        />
      </div>
      {!isVideoActive && <div className="video__inactive"><span className="voice-only">Voice only</span></div>}
      <div className="user__name">
        {user.name}
      </div>
      <div className={overlayClasses}>
        <UserActions
          isMute={isMute}
          setIsMute={setIsMute}
          setVolume={setVolume}
        />
      </div>
    </div>
  )
}

// ボリューム管理用

type UserActionProps = {
  setVolume: (volume: number) => void
  isMute: boolean
  setIsMute: (isMute: boolean) => void
}

const UserActions: React.VFC<UserActionProps> = React.memo(({ setVolume, isMute, setIsMute }) => {

  const classes = [
    "user__actions action-btns"
  ].filter(Boolean).join(" ")

  const onClick = useCallback(() => { setIsMute(!isMute) }, [isMute, setIsMute])

  return (
    <div className={classes}>
      <IconBtn icon={isMute ? faVolumeMute : faVolumeUp} onClick={onClick} iconSize="lg" reverse></IconBtn>
      <input type="range" className="volume-slider" disabled={isMute} defaultValue="0.5" min="0" max="1" step="0.1" onChange={e => setVolume(e.target.valueAsNumber)} />
    </div>
  )
})

export default User
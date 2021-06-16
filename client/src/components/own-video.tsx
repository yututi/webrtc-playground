import React, { useCallback, useEffect, useRef, useState } from "react"
import "./own-video.scss"
import IconBtn from "components/icon-btn"
import {
  faAngleUp,
  faAngleDown,
  faMicrophoneAltSlash,
  faMicrophoneAlt,
  faVideo,
  faVideoSlash,
  faCog
} from "@fortawesome/free-solid-svg-icons"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import {
  initDevices,
  setAudioMute,
  setVideoMute,
} from "redux/slices/devices"
import { toggleOwnVideo } from "redux/slices/current-room"
import DeviceSelectDialog from "./device-select-dialog"

const MyVideo: React.VFC = () => {

  const isOpen = useAppSelector(state => state.currentRoom.isOwnVideoOpen)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(initDevices())
  }, [dispatch])

  return (
    <div className={`my-video card ${isOpen ? "my-video--is-open" : ""}`}>
      <div className="my-video__box box">
        <Video></Video>
        <VideoActions></VideoActions>
      </div>
    </div>
  )
}

const Video = React.memo(() => {

  const ref = useRef<HTMLVideoElement>(null)

  const {
    videoId,
    isVideoMute
  } = useAppSelector(state => state.devices.current)
  console.log({isVideoMute, videoId})

  useEffect(() => {
    if (!videoId) return

    const currentEl = ref.current

    console.log({isVideoMute, videoId})

    if (isVideoMute) {
      currentEl.srcObject = null
      return
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoId,
        height: 300,
        width: 400
      },
      audio: false
    }).then(stream => {
      currentEl.srcObject = stream
    })

    return () => {
      currentEl.srcObject = null
    }
  }, [videoId, isVideoMute])

  return (
    <div className="video">
      <video ref={ref} autoPlay playsInline></video>
    </div>
  )
})

const VideoActions = React.memo(() => {

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeDialog = useCallback(() => setIsDialogOpen(false), [])

  const {
    isAudioPermitted,
    isVideoPermitted
  } = useAppSelector(state => state.devices.permission)

  const {
    isAudioMute,
    isVideoMute
  } = useAppSelector(state => state.devices.current)

  const openDialog = useCallback(() => {

    if (isAudioPermitted || isVideoPermitted) {
      setIsDialogOpen(true)
    } else {
      alert("カメラとオーディオへのアクセスを許可してください")
    }
  }, [isAudioPermitted, isVideoPermitted])

  const dispatch = useAppDispatch()

  const onAudioIconClick = useCallback(() => {
    dispatch(setAudioMute(!isAudioMute))
  }, [dispatch, isAudioMute])
  const onVideoIconClick = useCallback(() => dispatch(setVideoMute(!isVideoMute)), [dispatch, isVideoMute])

  const isOwnVideoOpen = useAppSelector(state => state.currentRoom.isOwnVideoOpen)

  const onOwnVideoTogglerClick = useCallback(() => {
    dispatch(toggleOwnVideo())
  }, [dispatch])

  return (
    <div className="box__btns action-btns">
      {isVideoPermitted && <IconBtn
        icon={isOwnVideoOpen ? faAngleDown : faAngleUp}
        color="secondary"
        onClick={onOwnVideoTogglerClick}
      />}
      <div className="spacer"></div>
      <IconBtn
        iconSize="lg"
        icon={faCog}
        onClick={openDialog}
        reverse
        color="white"
      />
      {isAudioPermitted && <IconBtn
        iconSize="lg"
        icon={isAudioMute ? faMicrophoneAltSlash : faMicrophoneAlt}
        onClick={onAudioIconClick}
        reverse
        color="white"
      />}
      {isVideoPermitted && <IconBtn
        iconSize="lg"
        icon={isVideoMute ? faVideoSlash : faVideo}
        onClick={onVideoIconClick}
        reverse
        color="white"
      />}
      <DeviceSelectDialog
        isOpen={isDialogOpen && (isVideoPermitted || isAudioPermitted)}
        close={closeDialog}
      />
    </div>
  )
})

export default MyVideo
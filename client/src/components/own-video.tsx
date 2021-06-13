import React, { useCallback, useEffect, useRef, useState } from "react"
import Dialog from "components/dialog"
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
  setAudioIn,
  setAudioMute,
  setVideoMute,
  setVideo,
  SerializableDeviceInfo
} from "redux/slices/devices"
import { toggleOwnVideo } from "redux/slices/current-room"

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

  useEffect(() => {
    if (!videoId) return

    const currentEl = ref.current

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
      <video ref={ref} autoPlay></video>
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

type DialogProps = {
  isOpen: boolean
  close: () => void
}
const DeviceSelectDialog: React.FC<DialogProps> = React.memo(({ isOpen, close }) => {


  const {
    audioIns,
    videos
  } = useAppSelector(state => state.devices.availableDevices)

  const {
    audioInId,
    videoId
  } = useAppSelector(state => state.devices.current)

  const dispatch = useAppDispatch()

  return (
    <Dialog isOpen={isOpen} dialogTitle="デバイスを選択してください" close={close}>
      <div className="device-selectors flex is-vertical">
        <DeviceSelector
          label="カメラ"
          currentDeviceId={audioInId}
          devices={videos}
          onSelect={device => dispatch(setVideo(device))}
        />
        <DeviceSelector
          label="オーディオ(入力)"
          currentDeviceId={videoId}
          devices={audioIns}
          onSelect={device => dispatch(setAudioIn(device))}
        />
      </div>
    </Dialog >
  )
})

type DeviceSelectorProps = {
  label: string
  currentDeviceId: string
  devices: (SerializableDeviceInfo)[]
  onSelect: (device: SerializableDeviceInfo) => void
}

const DeviceSelector: React.FC<DeviceSelectorProps> = React.memo(({ label, currentDeviceId, devices, onSelect }) => {

  const toDeviceName = (device: (SerializableDeviceInfo)) => device.deviceId === "default" ? "デフォルト" : device.label

  return (
    <div className="device-select">
      <label className="device-select__label">{label}</label>
      <select className="device-select__select" defaultValue={currentDeviceId} onChange={e => onSelect(devices.find(d => d.deviceId === e.target.value))}>
        {devices.map(device => (
          <option
            key={device.deviceId}
            value={device.deviceId}
          >
            {toDeviceName(device)}
          </option>
        ))}
        {devices.length === 0 ? (<option>選択可能なデバイスがありません</option>) : ""}
      </select>
    </div>
  )
})

export default MyVideo
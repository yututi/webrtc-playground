import React, { useCallback, useEffect, useRef, useState } from "react"
import Dialog from "components/dialog"
import "./my-video.scss"
import IconBtn from "components/icon-btn"
import {
  faAngleUp,
  faAngleDown,
  faVolumeMute,
  faVolumeUp,
  faVideo,
  faVideoSlash,
  faCog
} from "@fortawesome/free-solid-svg-icons"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import {
  initDevices,
  setAudioIn,
  setAudioMute,
  setAudioOut,
  setVideoMute,
  setVideo
} from "redux/slices/devices"

const MyVideo: React.VFC = () => {

  const [isOpen, setIsOpen] = useState(true)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(initDevices)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`my-video ${isOpen ? "my-video--is-open" : ""}`}>
      <div className="my-video__box box">
        <div className="box__opener">
          <IconBtn
            icon={isOpen ? faAngleDown : faAngleUp}
            color="secondary"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <Video></Video>
        <VideoActions></VideoActions>
      </div>
    </div>
  )
}

const Video = React.memo(() => {

  const ref = useRef<HTMLVideoElement>(null)

  const {
    currentVideoId,
    isVideoMute
  } = useAppSelector(state => state.devices)

  useEffect(() => {
    if (!currentVideoId) return

    const currentEl = ref.current

    if (isVideoMute) {
      currentEl.srcObject = null
      return
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: currentVideoId,
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
  }, [currentVideoId, isVideoMute])

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
    isAudioMute,
    isVideoMute,
    isDeviceAccessPermitetd
  } = useAppSelector(state => state.devices)

  const openDialog = useCallback(() => {

    if (isDeviceAccessPermitetd) {
      setIsDialogOpen(true)
    } else {
      alert("カメラとオーディオへのアクセスを許可してください")
    }
  }, [isDeviceAccessPermitetd])

  const dispatch = useAppDispatch()

  const onAudioIconClick = useCallback(() => dispatch(setAudioMute(!isAudioMute)), [dispatch, isAudioMute])
  const onVideoIconClick = useCallback(() => dispatch(setVideoMute(!isVideoMute)), [dispatch, isVideoMute])

  return (
    <div className="box__btns action-btns">
      <IconBtn
        iconSize="lg"
        icon={faCog}
        onClick={openDialog}
        reverse
        color="white"
      />
      <IconBtn
        iconSize="lg"
        icon={isAudioMute ? faVolumeMute : faVolumeUp}
        onClick={onAudioIconClick}
        reverse
        color="white"
      />
      <IconBtn
        iconSize="lg"
        icon={isVideoMute ? faVideoSlash : faVideo}
        onClick={onVideoIconClick}
        reverse
        color="white"
      />
      <DeviceSelectDialog
        isOpen={isDialogOpen && isDeviceAccessPermitetd}
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
    audioOuts,
    videos
  } = useAppSelector(state => state.devices.availableDevices)

  const {
    currentAudioInId,
    currentAudioOutId,
    currentVideoId
  } = useAppSelector(state => state.devices)

  const dispatch = useAppDispatch()

  return (
    <Dialog isOpen={isOpen} dialogTitle="デバイスを選択してください" close={close}>
      <div className="device-selectors flex is-vertical">
        <DeviceSelector
          label="カメラ"
          currentDeviceId={currentVideoId}
          devices={videos}
          onSelect={device => dispatch(setVideo(device))}
        />
        <DeviceSelector
          label="オーディオ(入力)"
          currentDeviceId={currentAudioInId}
          devices={audioIns}
          onSelect={device => dispatch(setAudioIn(device))}
        />
        <DeviceSelector
          label="オーディオ(出力)"
          currentDeviceId={currentAudioOutId}
          devices={audioOuts}
          onSelect={useCallback(device => dispatch(setAudioOut(device)), [dispatch])}
        />
      </div>
    </Dialog >
  )
})

type DeviceSelectorProps = {
  label: string
  currentDeviceId: string
  devices: (MediaDeviceInfo)[]
  onSelect: (device: MediaDeviceInfo) => void
}

const DeviceSelector: React.FC<DeviceSelectorProps> = React.memo(({ label, currentDeviceId, devices, onSelect }) => {

  const toDeviceName = (device: (MediaDeviceInfo)) => device.deviceId === "default" ? "デフォルト" : device.label

  return (
    <div className="device-select">
      <label className="device-select__label">{label}</label>
      <select className="device-select__select" value={currentDeviceId} onChange={e => onSelect(devices.find(d => d.deviceId === e.target.value))}>
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
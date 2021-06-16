import React from "react"
import Dialog from "components/dialog"
import "./own-video.scss"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import {
  setAudioIn,
  setVideo,
  SerializableDeviceInfo
} from "redux/slices/devices"

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
    <Dialog isOpen={isOpen} dialogTitle="デバイスを選択してください" close={close} closeIfOutsideClick>
      <div className="device-selectors flex is-vertical">
        <DeviceSelector
          label="カメラ"
          currentDeviceId={videoId}
          devices={videos}
          onSelect={device => dispatch(setVideo(device))}
        />
        <DeviceSelector
          label="オーディオ(入力)"
          currentDeviceId={audioInId}
          devices={audioIns}
          onSelect={device => dispatch(setAudioIn(device))}
        />
      </div>
    </Dialog>
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
    <div className="field">
      <label className="field__label">{label}</label>
      <select className="field__input" value={currentDeviceId} onChange={e => onSelect(devices.find(d => d.deviceId === e.target.value))}>
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

export default DeviceSelectDialog
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react"
import Dialog from "components/dialog"
import { useDeviceContext } from "modules/devices"
import { useCurrentDeviceContext } from "modules/current-device"
import "./my-video.scss"
import IconBtn from "components/icon-btn"
import { faArrowCircleUp, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons"

const MyVideo: React.VFC = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [isOpen, setIsOpen] = useState(true)

    const { isPermitted, requestPermission } = useDeviceContext()

    const closeDialog = useCallback(() => setIsDialogOpen(false), [])

    const openDialog = () => {
        setIsDialogOpen(true)
        !isPermitted && requestPermission().then(permit => {
            !permit && alert("カメラとマイクへのアクセスを許可してください")
        })
    }

    return (
        <div className={`my-video ${isOpen?"my-video--is-open": ""}`}>
            <div className="my-video__box box">
                <div className="box__opener">
                    <IconBtn icon={isOpen ? faArrowCircleDown: faArrowCircleUp} color="secondary" onClick={() => setIsOpen(!isOpen)}></IconBtn>
                </div>
                <Video></Video>
                <div className="box__btns action-btns">
                    <button className="btn" onClick={openDialog}>カメラを選択</button>
                </div>
                <DeviceSelectDialog
                    isOpen={isDialogOpen && isPermitted}
                    close={closeDialog}
                />
            </div>
        </div>
    )
}

const Video = () => {

    const ref = useRef<HTMLVideoElement>(null)

    const { camera } = useCurrentDeviceContext()

    useEffect(() => {
        if (!camera) return
        const currentEl = ref.current
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: camera.deviceId,
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
    }, [camera])

    return (
        <div className="video">
            <video ref={ref} autoPlay></video>
        </div>
    )
}

type DialogProps = {
    isOpen: boolean
    close: () => void
}

const DeviceSelectDialog: React.FC<DialogProps> = React.memo(({ isOpen, close }) => {

    const { videoinput, audioinput, audiooutput } = useDeviceContext()
    const {
        camera,
        audioIn,
        setInDevices,
        outDevice,
        setOutDevice
    } = useCurrentDeviceContext()

    return (
        <Dialog isOpen={isOpen} dialogTitle="デバイスを選択してください" close={close}>
            <div className="device-types">
                <div className="device-type">
                    <DeviceSelector
                        label="カメラ"
                        currentDevice={camera}
                        devices={videoinput}
                        onSelect={device => setInDevices({ camera: device, audioIn })}
                    />
                </div>
                <div className="device-type">
                    <DeviceSelector
                        label="オーディオ(入力)"
                        currentDevice={audioIn}
                        devices={audioinput}
                        onSelect={device => setInDevices({ camera, audioIn: device })}
                    />
                </div>
                <div className="device-type">
                    <DeviceSelector
                        label="オーディオ(出力)"
                        currentDevice={outDevice}
                        devices={audiooutput}
                        onSelect={device => setOutDevice(device)}
                    />
                </div>
            </div>
        </Dialog >
    )
})

type DeviceSelectorProps = {
    label: string
    currentDevice: (MediaDeviceInfo)
    devices: (MediaDeviceInfo)[]
    onSelect: (device: MediaDeviceInfo) => void
}

const DeviceSelector: React.FC<DeviceSelectorProps> = React.memo(({ label, currentDevice, devices, onSelect }) => {

    const toDeviceName = (device: (MediaDeviceInfo)) => device.deviceId === "default" ? "デフォルト" : device.label

    return (
        <>
            <label>{label}</label>
            <select value={currentDevice?.deviceId} onChange={e => onSelect(devices.find(d => d.deviceId === e.target.value))}>
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
        </>
    )
})

export default MyVideo
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import Dialog from "components/dialog"
import { getDevicesSubject } from "modules/device"


const MyVideo: React.FC = () => {

    // Contextによせてreducer使うべきか
    const [isPermitted, setIsPermitted] = useState(false)
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([])
    const [currentDevice, setCurrentDevice] = useState<MediaDeviceInfo>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const devicesSubject = getDevicesSubject()
        const subscribe = devicesSubject.subscribe({
            next: devices => {
                setAvailableDevices(devices)
                setIsPermitted(true)
            },
            error: e => {
                setIsPermitted(false)
            }
        })
        return () => {
            subscribe.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (!currentDevice) return
        navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true
            },
            video: {
                deviceId: currentDevice.deviceId,
                height: 300,
                width: 400,
                echoCancellation: true,
                noiseSuppression: true
            }
        }).then(stream => {
            videoRef.current.srcObject = stream
        })
    }, [currentDevice])

    const selectDevice = useCallback(device => {
        setCurrentDevice(device)
        setIsDialogOpen(false)
    }, [])

    return (
        <div className="video own-video">
            <video ref={videoRef} autoPlay></video>
            {!isPermitted ? (
                <div className="own-video__not-permitted">
                    カメラにアクセスできません。
                    <button className="btn" onClick={() => setIsDialogOpen(true)}>カメラを選択</button>
                </div>
            ) : null}
            <DeviceSelectDialog
                isOpen={isDialogOpen}
                devices={availableDevices}
                selectDevice={selectDevice}
                close={() => setIsDialogOpen(false)}
            />
        </div>
    )
}

type DialogProps = {
    isOpen: boolean
    devices: MediaDeviceInfo[]
    selectDevice: (device: MediaDeviceInfo) => void
    close: () => void
}

const DeviceSelectDialog: React.FC<DialogProps> = React.memo(({ isOpen, devices, selectDevice, close }) => {
    console.log("DeviceSelectDialog rendered")
    const title = devices.length ? "カメラを選択してください" : "アクセス可能なカメラがありません"
    return (
        <Dialog isOpen={isOpen} dialogTitle={title} close={close}>
            <ul>
                {devices.map(device => (
                    <li
                        onClick={() => selectDevice(device)}
                    >
                        {device.label}
                    </li>
                ))}
            </ul>
        </Dialog >
    )
})

export default MyVideo
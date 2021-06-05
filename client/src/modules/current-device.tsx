// import firebase, { store } from "modules/firebase"
import { createContext, useEffect, useState, useContext, useMemo, useCallback } from "react"

type SetDeviceType = ({ camera: MediaDeviceInfo, audioIn: MediaDeviceInfo })
type CurrentDeviceState = {
    camera?: MediaDeviceInfo
    audioIn: MediaDeviceInfo
    outDevice: MediaDeviceInfo
    setInDevices: (arg: SetDeviceType) => void
    setOutDevice: (device: MediaDeviceInfo) => void
    isVideoMute: boolean
    isAudioMute: boolean
    setIsVideoMute: (mute:boolean) => void
    setIsAudioMute: (mute:boolean) => void
}

const CurrentDeviceContext = createContext<CurrentDeviceState>(null)

export const CurrentDeviceProvider: React.FC = ({ children }) => {

    const [camera, setCamera] = useState<MediaDeviceInfo>(null)
    const [audioIn, setAudioIn] = useState<MediaDeviceInfo>(null)

    const [isVideoMute, setIsVideoMute] = useState(true)
    const [isAudioMute, setIsAudioMute] = useState(true)

    const [outDevice, setOutDevice] = useState<MediaDeviceInfo>(null)

    const setInDevices = useCallback(({ camera, audioIn }: SetDeviceType) => {

        setCamera(camera)
        setAudioIn(audioIn)
        // navigator.mediaDevices.getUserMedia({
        //     audio: !!audioIn && {
        //         deviceId: audioIn.deviceId,
        //         noiseSuppression: true,
        //         echoCancellation: true
        //     },
        //     video: !!camera && {
        //         deviceId: camera.deviceId
        //     }
        // }).then(stream => {
        //     setInStream(stream)
        // })
    }, [])

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {

            const camera = devices.find(device => device.kind === "videoinput")
            const audioIn = devices.find(device => device.kind === "audioinput" && device.deviceId === "default")

            setInDevices({
                camera,
                audioIn
            })

            const currentAudioOut = devices.find(device => device.kind === "audiooutput" && device.deviceId === "default")
            setOutDevice(currentAudioOut)

        })
    }, [])

    const value = {
        camera,
        audioIn,
        outDevice,
        setInDevices,
        setOutDevice,
        isVideoMute,
        isAudioMute,
        setIsVideoMute,
        setIsAudioMute
    }

    return <CurrentDeviceContext.Provider value={value}> {children} </CurrentDeviceContext.Provider>
}

export const useCurrentDeviceContext = () => {
    return useContext(CurrentDeviceContext)
}
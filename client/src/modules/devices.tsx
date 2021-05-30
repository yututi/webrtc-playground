// import firebase, { store } from "modules/firebase"
import { createContext, useEffect, useState, useContext, useMemo, useCallback } from "react"

type DeviceState = {
    isPermitted: boolean
    videoinput: InputDeviceInfo[]
    audioinput: InputDeviceInfo[]
    audiooutput: MediaDeviceInfo[]
    requestPermission: () => Promise<boolean>
}

const DeviceContext = createContext<DeviceState>(null)

export const DeviceProvider: React.FC = ({ children }) => {

    const [isPermitted, setPermitted] = useState(false)
    const [devices, setDevices] = useState({
        videoinput: [],
        audioinput: [],
        audiooutput: []
    })

    const requestPermission = useCallback(() => {
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(() => {
            setPermitted(true)
            return true
        }).catch(e => {
            setPermitted(false)
            return false
        })
    }, [])

    useEffect(() => {

        const updateDevices = () => {
            return navigator.mediaDevices.enumerateDevices().then(devices => {
                const devicesInfo = devices.reduce((acc, cur) => {
                    acc[cur.kind].push(cur)
                    return acc
                }, {
                    videoinput: [],
                    audioinput: [],
                    audiooutput: []
                })
                setDevices(devicesInfo)

                return devicesInfo
            })
        }
        isPermitted && updateDevices()

        isPermitted && navigator.mediaDevices.addEventListener("devicechange", updateDevices)

        return () => {
            isPermitted && navigator.mediaDevices.removeEventListener("devicechange", updateDevices)
        }
    }, [isPermitted])

    const value = {
        ...devices,
        requestPermission,
        isPermitted
    }

    return <DeviceContext.Provider value={value}> {children} </DeviceContext.Provider>
}

export const useDeviceContext = () => {
    return useContext(DeviceContext)
}
// import firebase, { store } from "modules/firebase"
import { useEffect, useState, useCallback } from "react"

export const useDevices = () => {

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

  return {
    ...devices,
    requestPermission,
    isPermitted
  }
}

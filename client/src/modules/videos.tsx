import { BehaviorSubject, fromEvent } from "rxjs"
import { map } from "rxjs/operators"

type MyDeviceInfo = {
    availableDevices: MediaDeviceInfo[]
    isPermitted: boolean
}

export const camerasSubject = new BehaviorSubject<MyDeviceInfo>({
    availableDevices: [],
    isPermitted: false
})

export const myVideoStreamSubject = new BehaviorSubject<MediaStream>(null)

const updateAvailableDevices = () => {
    getVideoDevices()
        .then(devices => camerasSubject.next({
            availableDevices: devices,
            isPermitted: true
        }))
        .catch(e => camerasSubject.next({
            availableDevices: [],
            isPermitted: false
        }))
}
navigator.mediaDevices.addEventListener("devicechange", updateAvailableDevices)

export async function requestPermission() {
    await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(() => {
        updateAvailableDevices()
    }).catch(e => {
        if (!camerasSubject.value.isPermitted) return
        camerasSubject.next({
            availableDevices: camerasSubject.value.availableDevices,
            isPermitted: false
        })
    })
}

async function getVideoDevices() {
    // 先にgetUserMediaでパーミッションとらないとenumerateDevicesでカメラを取得できない
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log("enumerateDevices", devices)
    return devices.filter(device => device.kind === "videoinput")
}

async function gedAudioInputDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log("enumerateDevices", devices)
    return devices.filter(device => device.kind === "audioinput")
}

async function gedAudioOutputDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log("enumerateDevices", devices)
    return devices.filter(device => device.kind === "audiooutput")
}

export const setMyVideoDevice = (device: MediaDeviceInfo) => {
    navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true
        },
        video: {
            deviceId: device.deviceId,
            height: 300,
            width: 400,
            echoCancellation: true,
            noiseSuppression: true
        }
    }).then(stream => {
        myVideoStreamSubject.next(stream)
    }).catch(e => {
        myVideoStreamSubject.error(e)
    })
}

export function getPeerVideoStreamSubject(peerConnection: RTCPeerConnection) {

    const subject = new BehaviorSubject<MediaStream>(null)

    const ovservable = fromEvent<RTCTrackEvent>(peerConnection, "track").pipe(map(e => e.track))

    ovservable.subscribe(track => {
        if (subject.value) {
            subject.value.addTrack(track)
        } else {
            const stream = new MediaStream()
            stream.addTrack(track)
            subject.next(stream)
        }
    })

    return subject
}
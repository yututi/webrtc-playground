import { Subject } from "rxjs"
import { finalize } from "rxjs/operators"

export function getDevicesSubject() {

    const subject = new Subject<MediaDeviceInfo[]>()
    subject.pipe(
        finalize(() => {
            console.log("unsubscribe")
            navigator.mediaDevices.removeEventListener("devicechange", update)
        })
    )

    const update = () => {

        getVideoDevices()
            .then(devices => subject.next(devices))
            .catch(e => subject.error(e))
    }
    update()

    navigator.mediaDevices.addEventListener("devicechange", update)

    return subject
}

async function getVideoDevices() {
    // 先にgetUserMediaでパーミッションとらないとenumerateDevicesでカメラを取得できない
    await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log("enumerateDevices", devices)
    return devices.filter(device => device.kind === "videoinput")
}
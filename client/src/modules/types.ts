export type Room = {
    id: string
    name: string
    type: "voice" | "text"
}

export type User = {
    id: string
    name: string
    offer?: RTCSessionDescriptionInit
}
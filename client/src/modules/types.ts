export type Room = {
    name: string
    users: number
    type?: "voice" | "text"
}

export type User = {
    id: string
    name: string
    offer?: RTCSessionDescriptionInit
}
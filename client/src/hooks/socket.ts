import { io, Socket } from "socket.io-client"
import { isDevelopment } from "utils"

const HOST = isDevelopment ? `ws://localhost:5000` : window.location

// singleton socket
let _socket = null
const getScoket = (): Socket => {
    if (_socket) return _socket
    else return _socket = io(HOST)
}

export function useSocket() {
    const socket = getScoket()
    return { socket }
}
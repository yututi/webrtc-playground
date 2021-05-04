import { useEffect, useMemo, useState } from "react"
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
    const [isConnected, setIsConnected] = useState(socket.connected)

    // const socket = useMemo(() => {
    //     return io()
    // }, [])

    useEffect(() => {
        socket.on("connected", () => {
            console.log("socket connected.")
            setIsConnected(true)
        })
        socket.on("disconnect", () => {
            // TODO 再接続すべき?
            console.log("socket disconnected.")
            setIsConnected(false)
        })
        return () => {
            socket.close()
        }
    }, [socket])

    return { socket, isConnected }
}
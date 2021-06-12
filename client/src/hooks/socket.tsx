import React, { createContext, useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { useAppSelector } from "redux/hooks"
import { io, Socket } from "socket.io-client"
import { isDevelopment } from "utils"

const HOST = isDevelopment ? `ws://localhost:5000` : window.location

type SocketState = Socket

const SocketContext = createContext<SocketState>(null)

export const SocketProvider: React.FC = ({ children }) => {

  const userName = useAppSelector(state => state.global.userName)
  const userIsDefined = useAppSelector(state => state.global.isUserNameDefined)

  const [socket, setSocket] = useState<Socket>(null)

  useEffect(() => {
    if (!userIsDefined) return
    const socket = io(HOST, {
      query: {
        userName
      }
    })
    setSocket(socket)
  }, [userIsDefined, userName])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}

// Socketの管理を行うContext
// non-serializableのためReduxで管理できないためsocketだけここで管理する

import React, { createContext, useMemo } from "react"
import { useContext } from "react"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import { setUserId } from "redux/slices/global"
import { io, Socket } from "socket.io-client"
import { isDevelopment } from "utils"

const HOST = isDevelopment ? `ws://localhost:5000` : `wss://${window.location.hostname}`

type SocketState = Socket | null

const SocketContext = createContext<SocketState>(null)

export const SocketProvider: React.FC = ({ children }) => {

  const userName = useAppSelector(state => state.global.userName)
  const userIsDefined = useAppSelector(state => state.global.isUserNameDefined)
  const dispatch = useAppDispatch()

  const socket = useMemo(() => {
    if (!userIsDefined) return null

    console.log("create socket.", userName)

    const socket = io(HOST, {
      query: {
        userName
      },
      path: "/soc/"
    })

    // 払いだされたidをReduxに渡す
    socket.on("connect", () => {
      if (socket.connected) {
        console.log("socket connected.", { socket })
      }
      socket.connected && dispatch(setUserId(socket.id))
    })

    return socket
  }, [dispatch, userIsDefined, userName])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}

import React, { Suspense } from "react"
import Rooms from "components/rooms"
import Header from "components/header"
import Nav from "components/nav"
import { classMap } from "utils"
import { useAppSelector } from "redux/hooks"
import { selectIsRoomJoined } from "redux/slices/current-room"
import { selectIsNavOpen } from "redux/slices/global"
const CurrentRoom = React.lazy(() => import("components/current-room"))

export default function App() {

  return (
    <main className="main flex is-vertical">
      <Header
        title="WebRTC Playground"
      />
      <Body>
        <Content />
        <Nav>
          <Rooms />
        </Nav>
      </Body>
    </main>
  )
}

const Body = ({ children }) => {

  const isNavOpen = useAppSelector(selectIsNavOpen)

  const bodyClass = classMap({
    "body--has-left-nav": isNavOpen
  })

  return (
    <div className={`main__body body flex-item--grow ${bodyClass}`}>
      {children}
    </div>
  )
}

const Content = () => {

  const isJoinedRoom = useAppSelector(selectIsRoomJoined)

  return (
    <div className="body__content">
      {isJoinedRoom && <Suspense fallback={false}><CurrentRoom /></Suspense>}
    </div>
  )
}

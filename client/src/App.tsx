import React, { useCallback, useMemo, useState } from "react"
import Rooms from "components/rooms"
import CurrentRoom from "components/current-room"
import Header from "components/header"
import { useRoomContext } from "modules/current-room"
import Nav from "components/nav"
import { classMap } from "utils"

export default function App() {

  const { room } = useRoomContext()

  const [isNavOpen, setIsNavOpen] = useState(false)

  const closeNav = useCallback(() => setIsNavOpen(false), [])

  const bodyClass = classMap({
    "body--has-left-nav": isNavOpen
  })

  return (
    <main className="main flex is-vertical">
      <Header
        title="WebRTC Playground"
        onHamburgerClick={() => setIsNavOpen(!isNavOpen)}
      />
      <div className={`main__body body flex-item--grow ${bodyClass}`}>
        <div className="body__content">
          {room && <CurrentRoom />}
        </div>
        <Nav
          isOpen={isNavOpen}
          onClose={closeNav}
        >
          <Rooms />
        </Nav>
      </div>
    </main>
  )
}

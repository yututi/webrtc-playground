import React, { useCallback, useMemo, useState } from "react"
import Rooms from "components/rooms"
import CurrentRoom from "components/current-room"
import Header from "components/header"
import { useRoomContext } from "modules/current-room"
import Nav from "components/nav"
import { isMobile } from "utils"

export default function App() {

  const { room } = useRoomContext()

  const [isNavOpen, setIsNavOpen] = useState(false)

  const closeNav = useCallback(() => setIsNavOpen(false), [])

  return (
    <main className="main flex is-vertical">
      <Header
        title="WebRTC Playground"
        onHamburgerClick={() => setIsNavOpen(!isNavOpen)}
      />
      <div className="main__body flex-item--grow">
        <Nav
          isOpen={isNavOpen}
          onClose={closeNav}
        >
          <Rooms />
        </Nav>
        {room ? (
          <CurrentRoom />
        ) : null}
      </div>
    </main>
  )
}
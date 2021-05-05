import React from "react"
import Rooms from "components/rooms"
import CurrentRoom from "components/current-room"
import Header from "components/header"
import { useRoomContext } from "modules/current-room"

export default function App() {

  const { room } = useRoomContext()

  return (
    <main className="main">
      <Header title="WebRTC Playground"></Header>
      <Rooms />
      {room ? (
        <CurrentRoom />
      ) : null}
    </main>
  )
}
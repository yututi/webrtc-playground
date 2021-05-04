import React from "react"
import { MeProvider } from "modules/me"
import { RoomsProvider } from "modules/rooms"
import Rooms from "components/rooms"
import Header from "components/header"

export default function App() {
  return (
    <main className="main">
      <RootProvider>
        <Header title="WebRTC-Playground"></Header>
        <Rooms></Rooms>
      </RootProvider>
    </main>
  )
}

const composeWrappers = (
  wrappers: React.FC[]
): React.FC => {
  return wrappers.reduce((Acc, Current): React.FunctionComponent => {
    return props => <Current><Acc {...props} /></Current>
  });
}

const RootProvider = composeWrappers([
  props => <MeProvider>{props.children}</MeProvider>,
  props => <RoomsProvider>{props.children}</RoomsProvider>
])
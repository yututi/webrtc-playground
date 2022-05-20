import Rooms from "components/rooms"
import Header from "components/header"
import Nav from "components/nav"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import { selectIsNavOpen, setMedia } from "redux/slices/global"
import useMediaQuery from "hooks/media"
import Toasts from "components/toast"

import useRoomsSyncronizer from "hooks/rooms";
import Routes from "routes"


export default function App() {

  const theme = useAppSelector(state => state.global.theme)

  const classes = [
    "main flex is-vertical",
    theme
  ].filter(Boolean).join(" ")

  const dispatch = useAppDispatch()

  useMediaQuery({
    query: "(min-width: 799px)",
    onMediaMatched: isPc => {
      dispatch(setMedia(isPc ? "pc" : "sp"))
    }
  })

  useRoomsSyncronizer()

  return (
    <main className={classes}>
      <Header
        title="WebRTC Playground"
      />
      <Body>
        <Content />
        <Nav>
          <Rooms />
        </Nav>
        <Toasts />
      </Body>
    </main>
  )
}

const Body = ({ children }) => {

  const isNavOpen = useAppSelector(selectIsNavOpen)

  const classes = [
    "main__body body flex-item--grow",
    isNavOpen && "body--has-left-nav"
  ].filter(Boolean).join(" ")

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

const Content = () => {

  return (
    <div className="body__content">
      <Routes></Routes>
    </div>
  )
}

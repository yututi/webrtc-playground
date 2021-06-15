import React, { Suspense, useEffect } from "react"
import Rooms from "components/rooms"
import Header from "components/header"
import Nav from "components/nav"
import NewRoom from "components/new-room"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import { selectIsNavOpen, setMedia } from "redux/slices/global"
import { Route, Switch, Link } from 'react-router-dom';
import useMediaQuery from "hooks/media"

const CurrentRoom = React.lazy(() => import("components/current-room"))


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

  return (
    <main className={classes}>
      <Header
        title="⚡️ WebRTC Playground"
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
      <Suspense fallback={false}>
        <Switch>
          <Route exact path="/" component={Empty} />
          <Route path="/rooms/:roomId" component={CurrentRoom} />
          <Route path="/newroom" component={NewRoom} />
        </Switch>
      </Suspense>
    </div>
  )
}

const Empty = () => {

  return (
    <div className="card emptypage">
      <span>↖️メニューを開いて部屋を選択<br />または、<Link to="/newroom">新しく部屋を作成</Link></span>
    </div>
  )
}
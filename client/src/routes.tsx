import Empty from 'pages'
import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

const CurrentRoom = React.lazy(() => import("pages/current-room"))
const NewRoom = React.lazy(() => import("pages/new-room"))
// <TransitionRoute path="/">
//   <Empty />
// </TransitionRoute>
// <TransitionRoute path="/rooms/:roomId">
//   <Suspense fallback={false}>
//     <CurrentRoom />
//   </Suspense>
// </TransitionRoute>
// <TransitionRoute path="/newroom">
//   <Suspense fallback={false}>
//     <NewRoom />
//   </Suspense>
// </TransitionRoute>

const routes = [
  { path: "/", Component: Empty },
  { path: "/rooms/:roomId", Component: CurrentRoom },
  { path: "/newroom", Component: NewRoom }
]

const Routes = () => {

  return (
    <>
      {routes.map(({ path, Component }) => (
        <Route key={path} exact path={path}>
          {({ match }) => (
            <CSSTransition
              in={!!match}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <Suspense fallback={false}>
                <Component />
              </Suspense>
            </CSSTransition>
          )}
        </Route>
      ))}
    </>
  )
}

export default Routes

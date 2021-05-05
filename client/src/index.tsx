import React from "react"
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MeProvider } from "modules/me"
import { RoomsProvider } from "modules/rooms"
import { RoomProvider } from "modules/current-room"

const composeWrappers = (
  wrappers: React.FC[]
): React.FC => {
  return wrappers.reduce((Acc, Current): React.FunctionComponent => {
    return props => <Current><Acc {...props} /></Current>
  });
}

const RootProvider = composeWrappers([
  props => <MeProvider>{props.children}</MeProvider>,
  props => <RoomsProvider>{props.children}</RoomsProvider>,
  props => <RoomProvider>{props.children}</RoomProvider>
])

ReactDOM.render(
  <React.StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
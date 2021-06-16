import React, { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { Room } from "types"
import "./rooms.scss"
// import { useRoomContext } from "modules/current-room";
import { useAppSelector } from "redux/hooks"
import {
  selectRooms, selectUsersByRoomId
} from "redux/slices/rooms"
import { useHistory } from "react-router-dom";

const RoomAdder = React.lazy(() => import("components/room-adder"))

const Rooms: React.FC = React.memo(() => {

  const rooms = useAppSelector(selectRooms)

  return (
    <div className="rooms">
      {rooms.map(room => <RoomComponent key={room.id} room={room}></RoomComponent>)}
      <Suspense fallback={null}><RoomAdder /></Suspense>
    </div>
  )
})

type Props = {
  room: Room
}
const RoomComponent: React.FC<Props> = React.memo(({ room }) => {

  const history = useHistory()

  const users = useAppSelector(selectUsersByRoomId(room.id))

  const onClick = () => {
    history.push(`/rooms/${room.id}`)
  }

  return (
    <div key={room.name} className="rooms__room room hl" onClick={onClick}>
      <div className="room__name">
        {room.name}
      </div>
      <div className="spacer"></div>
      <div>
        <FontAwesomeIcon className="room__icon" icon={faUsers} size="1x" />
        <span className="ml-1">{users.length}</span>
      </div>
    </div>
  )
})

export default Rooms

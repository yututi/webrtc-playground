import React, { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { Room } from "types"
import "./rooms.scss"
// import { useRoomContext } from "modules/current-room";
import { useAppDispatch, useAppSelector } from "redux/hooks"
import {
  selectRooms,
  addUser,
  addRoom,
  removeUser,
  removeRoom,
  setRooms
} from "redux/slices/rooms"
import { joinRoom } from "redux/slices/current-room"
import useRooms from "hooks/rooms";
import { useHistory } from "react-router-dom";

const RoomAdder = React.lazy(() => import("components/room-adder"))

const Rooms: React.FC = React.memo(() => {

  const dispatch = useAppDispatch()

  const rooms = useAppSelector(selectRooms)

  useRooms({
    onMemberJoined: user => {
      dispatch(addUser(user))
    },
    onMemberLeaved: user => {
      console.log("onMemberLeaved", { user })
      dispatch(removeUser(user))
    },
    onRoomAdded: room => {
      console.log({ room })
      dispatch(addRoom(room))
    },
    onRoomRemoved: room => {
      dispatch(removeRoom(room.name))
    },
    onRooms: rooms => {
      dispatch(setRooms(rooms))
    }
  })

  return (
    <div className="rooms">
      {rooms.map(room => <RoomComponent key={room.id} room={room}></RoomComponent>)}
      {rooms.length === 0 ? (
        <h3>No rooms...</h3>
      ) : ""
      }
      <Suspense fallback={null}><RoomAdder /></Suspense>
    </div>
  )
})

type Props = {
  room: Room
}
const RoomComponent: React.FC<Props> = ({ room }) => {

  const dispatch = useAppDispatch()

  const history = useHistory()

  const onClick = () => {
    dispatch(joinRoom(room))
    history.push(`/rooms/${room.id}`)
  }

  return (
    <div key={room.name} className="rooms__room room" onClick={onClick}>
      <div className="room__name">
        {room.name}
      </div>
      <div className="spacer"></div>
      <div>
        <FontAwesomeIcon className="room__icon" icon={faUsers} size="1x" />
        <span className="ml-1">{room.numberOfPeople}</span>
      </div>
    </div>
  )
}

export default Rooms

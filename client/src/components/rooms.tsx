import React, { Suspense } from "react";
import { useRoomsContext } from "modules/rooms"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { Room } from "modules/types"
import "./rooms.scss"
import { useRoomContext } from "modules/current-room";

const RoomAdder = React.lazy(() => import("components/room-adder"))

const Rooms: React.FC = React.memo(() => {

    const { rooms } = useRoomsContext()

    return (
        <div className="rooms">
            {rooms.map(room => <RoomComponent key={room.name} room={room}></RoomComponent>)}
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

    const { setRoom } = useRoomContext()

    const onClick = () => {
        setRoom(room)
    }

    return (
        <div key={room.name} className="rooms__room room" onClick={onClick}>
            <div className="room__name">
                {room.name}
            </div>
            <div className="spacer"></div>
            <div>
                <FontAwesomeIcon className="room__icon" icon={faUsers} size="1x" />
                <span className="ml-1">{room.users}</span>
            </div>
        </div>
    )
}

export default Rooms
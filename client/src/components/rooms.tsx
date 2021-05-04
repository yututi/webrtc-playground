import React from "react";
import { useRoomsContext } from "modules/rooms"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faPlus } from "@fortawesome/free-solid-svg-icons"

const Rooms: React.FC = () => {

    const { rooms } = useRoomsContext()

    return (
        <div className="rooms">
            {rooms.map(room => {
                return (
                    <div key={room.name} className="rooms__room room">
                        <div className="room__detail">
                            <div className="room__name">
                                {room.name}
                            </div>
                            <div className="flex-spacer"></div>
                            <FontAwesomeIcon className="room__icon" icon={faUsers} size="1x" />
                        </div>
                    </div>
                )
            })}
            {rooms.length === 0 ? (
                <h3>No rooms...</h3>
            ) : ""
            }
            <div className="rooms__adder adder">
                <FontAwesomeIcon className="adder__icon" icon={faPlus} />
            </div>
        </div>
    )
}


export default Rooms
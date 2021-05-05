import React from "react";
import { useRoomsContext } from "modules/rooms"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { useUserContext } from "modules/users";


const User: React.FC = () => {

    const {name} = useUserContext()

    return (
        <div className="rooms">
            {name}
        </div>
    )
}

export default User
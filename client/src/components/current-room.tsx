import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { useRoomContext } from "modules/current-room";
import { UserProvider } from "modules/users"
import User from "components/user"


const CurrentRoom: React.FC = () => {
    const { users } = useRoomContext()
    return (
        <div className="current-room">
            {users.map(user => {
                return (
                    <UserProvider key={user.id} user={user}>
                        <User></User>
                    </UserProvider>
                )
            })}
        </div>
    )
}

export default CurrentRoom
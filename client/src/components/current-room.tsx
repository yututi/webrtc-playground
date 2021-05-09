import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { useRoomContext } from "modules/current-room";
import { UserProvider } from "modules/users"
import User from "components/user-video"
import MyVideo from "components/my-video"


const CurrentRoom: React.FC = () => {
    const { users } = useRoomContext()
    return (
        <div className="current-room">
            <div className="current-room__users">
                {users.map(user => {
                    return (
                        <UserProvider key={user.id} user={user}>
                            <User></User>
                        </UserProvider>
                    )
                })}
            </div>
            <div>
                <MyVideo></MyVideo>
            </div>
        </div>
    )
}

export default CurrentRoom
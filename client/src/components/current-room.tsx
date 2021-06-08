import React, { CSSProperties, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { useRoomContext } from "modules/current-room";
import { UserProvider } from "modules/users"
import User from "components/user-video"
import MyVideo from "components/my-video"
import "./current-room.scss"
import { VIDEO } from "modules/const"


const CurrentRoom: React.FC = () => {
    const { users, room, setRoom } = useRoomContext()

    // const userStyle: CSSProperties = useMemo(() => {
    //     return {
    //         width: `calc(${1 / Math.min(users.length, 3) * 100}%)`,
    //         maxWidth: `${VIDEO.WIDTH}px`
    //     }
    // }, [users.length])

    return (
        <div className="current-room">
            <div className="current-room__header flex is-align-center">
                <span>{room.name}</span>
                <div className="spacer"></div>
                <button onClick={() => setRoom(null)}>Leave</button>
            </div>
            <div className="current-room__users users">
                {users.map(user => {
                    return (
                        <UserProvider key={user.id} user={user}>
                            <div 
                                className="users__user" 
                                // style={userStyle}
                            >
                                <User></User>
                            </div>
                        </UserProvider>
                    )
                })}
            </div>
            <MyVideo></MyVideo>
        </div>
    )
}

export default CurrentRoom
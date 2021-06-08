import React, { CSSProperties, useEffect, useRef } from "react";
import { useRoomsContext } from "modules/rooms"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { useUserContext } from "modules/users";
import "./user-video.scss"

type Props = {
}

const User: React.VFC<Props> = ({  }) => {

    const { name, stream } = useUserContext()

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        videoRef.current.srcObject = stream
        videoRef.current.volume = 0.5
    }, [stream])


    return (
        <div className="user video">
            <div className="video__inner">
                <video 
                    className="user__video" 
                    ref={videoRef}
                    autoPlay 
                />
            </div>
            <div className="user__actions action-btns">
                {name}
            </div>
            <div className="user__name">
                {name}
            </div>
        </div>
    )
}

export default User
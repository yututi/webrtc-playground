import React, { useEffect, useRef } from "react";
import { useRoomsContext } from "modules/rooms"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { useUserContext } from "modules/users";


const User: React.FC = () => {

    const { name, stream } = useUserContext()

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        videoRef.current.srcObject = stream
    }, [stream])

    return (
        <div className="user">
            <video className="user__video" ref={videoRef} autoPlay></video>
            <div className="user__video-overlay">
                {name}
            </div>
        </div>
    )
}

export default User
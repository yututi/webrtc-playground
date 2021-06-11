import React, { useEffect, useRef } from "react";
import "./user-video.scss"
import { UserWithOffer } from "types";
import { useP2PConnect } from "hooks/p2p-connect";
import { useAppSelector } from "redux/hooks";


type Props = { 
  user: UserWithOffer
}

const User: React.VFC<Props> = ({user}) => {

    const videoRef = useRef<HTMLVideoElement>(null)

    const localUseName = useAppSelector(state => state.global.userName)

    const {
      remoteUserName,
      p2p
    } = useP2PConnect(
      user,
      localUseName,
    )

    useEffect(() => {
        videoRef.current.srcObject = p2p.stream
        videoRef.current.volume = 0.5
    }, [p2p])

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
                {}
            </div>
            <div className="user__name">
                {remoteUserName}
            </div>
        </div>
    )
}

export default User
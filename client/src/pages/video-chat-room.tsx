import React, { useEffect } from "react";
import User from "components/user-video"
import MyVideo from "components/own-video"
import "./video-chat-room.scss"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import useCurrentRoomSyncronizer from "hooks/current-room";
import { useParams } from "react-router-dom";
import B2HBtn from "components/back-to-home-btn";
import { addInfoMessage } from "redux/slices/messages";


const CurrentRoom: React.VFC = () => {

  const { roomId } = useParams<{ roomId: string }>()

  useCurrentRoomSyncronizer(roomId)

  return (
    <div className="page-predentation">
      <div className="card current-room">
        <Header />
        <Users />
        <MyVideo />
      </div>
    </div>
  )
}

const Header: React.VFC = () => {

  const room = useAppSelector(root => root.currentRoom.room)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (room) {
      dispatch(addInfoMessage(`${room.name}に入室しました`))
    }
  }, [dispatch, room])

  return (
    <div className="current-room__header flex is-align-center">
      <B2HBtn text="退出"></B2HBtn>
      <span className="current-room__title ml-1">{room?.name}</span>
    </div>
  )
}

const Users: React.VFC = () => {

  const users = useAppSelector(root => root.currentRoom.users)

  return (
    <div className="current-room__users users">
      {users.map(user => (
        <div
          className="users__user"
          key={user.id}
        // style={userStyle}
        >
          <User user={user}></User>
        </div>
      ))}
    </div>
  )
}

export default CurrentRoom

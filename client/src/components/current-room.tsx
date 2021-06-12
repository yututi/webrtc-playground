import React from "react";
import User from "components/user-video"
import MyVideo from "components/my-video"
import "./current-room.scss"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import {
  leaveRoom,
  addUser,
  removeUserById,
  addUsers
} from "redux/slices/current-room"
import useCurrentRoom from "hooks/current-room";


const CurrentRoom: React.VFC = () => {

  const dispatch = useAppDispatch();

  const {
    room,
    users
  } = useAppSelector(root => root.currentRoom)

  useCurrentRoom({
    room,
    onMemberJoined: user => {
      dispatch((addUser({
        id: user.from,
        name: user.name,
        offer: user.offer
      })))
    },
    onMemberLeaved: userId => {
      dispatch(removeUserById(userId))
    },
    onRoomJoined: alreadyJoinedUserIds => {
      const userInfos = alreadyJoinedUserIds.map(id => {
        return {
          id,
          name: "-"
        }
      })
      console.log({ userInfos })
      dispatch(addUsers(userInfos))
    }
  })

  return (
    <div className="current-room">
      <div className="current-room__header flex is-align-center">
        <span>{room.name}</span>
        <div className="spacer"></div>
        <button onClick={() => dispatch(leaveRoom())}>Leave</button>
      </div>
      <div className="current-room__users users">
        {users.map(user => {
          return (
            <div
              className="users__user"
              key={user.id}
            // style={userStyle}
            >
              <User user={user}></User>
            </div>
          )
        })}
      </div>
      <MyVideo></MyVideo>
    </div>
  )
}

export default CurrentRoom
import React from "react";
import User from "components/user-video"
import MyVideo from "components/own-video"
import "./current-room.scss"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import {
  addUser,
  removeUserById,
  setUsersWithoutMyOwn,
  leaveRoomById
} from "redux/slices/current-room"
import useCurrentRoom from "hooks/current-room";
import { useHistory, useParams } from "react-router-dom";
import B2HBtn from "./back-to-home-btn";


const CurrentRoom: React.VFC = () => {

  const dispatch = useAppDispatch();

  const { roomId } = useParams<{ roomId: string }>()

  const room = useAppSelector(root => root.currentRoom.room)
  const users = useAppSelector(root => root.currentRoom.users)

  useCurrentRoom({
    roomId,
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
    onRoomJoined: alreadyJoinedUsers => {
      // console.log({ userInfos })
      dispatch(setUsersWithoutMyOwn(alreadyJoinedUsers))
    },
    onRoomLeaved: () => {
      dispatch(leaveRoomById(roomId))
    }
  })

  const history = useHistory()

  // urlに直接部屋IDをいれた場合やリロードした場合、roomがnullになる。
  // 再入室は難易度が高いのでトップページに戻す
  // TODO 再入室する方法を考える
  if (!room) {

    setTimeout(() => {
      history.push("/")
    })

    return (
      <div></div>
    )
  }

  return (
    <div className="card current-room">
      <div className="current-room__header flex is-align-center">
        <B2HBtn text="退出"></B2HBtn>
        <span className="current-room__title ml-1">{room.name}</span>
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

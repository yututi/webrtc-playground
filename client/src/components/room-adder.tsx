import React from "react";
import { useHistory } from "react-router-dom"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import "./room-adder.scss"
import IconBtn from "./icon-btn";

const RoomAdder: React.FC = React.memo(() => {

  const history = useHistory()

  return (
    <div className="adder mt-1">
      <IconBtn
        iconSize="1x"
        icon={faPlus}
        flat
        text="部屋を作成"
        onClick={() => history.push("/newroom")}
      />
    </div>
  )
})

export default RoomAdder
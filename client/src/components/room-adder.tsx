import React from "react";
import { useHistory } from "react-router-dom"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import "./room-adder.scss"
import IconBtn from "./icon-btn";

const RoomAdder: React.FC = () => {

  const history = useHistory()

  return (
    <div className="adder mt-1">
      <IconBtn
        size="sm"
        iconSize="1x"
        icon={faPlus}
        onClick={() => history.push("/newroom")}
      />
    </div>
  )
}

export default RoomAdder
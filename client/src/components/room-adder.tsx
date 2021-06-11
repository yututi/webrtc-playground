import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import RoomConfigDialog from "components/room-conf-dialog"
import "./room-adder.scss"
import IconBtn from "./icon-btn";

const RoomAdder: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="adder">
        <IconBtn
          small
          iconSize="1x"
          icon={faPlus}
          onClick={() => setIsOpen(true)}
        />
      </div>
      <RoomConfigDialog isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  )
}

export default RoomAdder
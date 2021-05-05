import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import RoomConfigDialog from "components/room-conf-dialog"


const RoomAdder: React.FC = () => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="adder">
                <FontAwesomeIcon
                    className="adder__icon"
                    icon={faPlus}
                    onClick={() => setIsOpen(true)}
                />
            </div>
            <RoomConfigDialog isOpen={isOpen} close={() => setIsOpen(false)} />
        </>
    )
}

export default RoomAdder
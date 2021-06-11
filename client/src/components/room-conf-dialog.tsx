import React, { useRef, useState } from "react";
import Dialog from "components/dialog"
import { useRoomsContext } from "modules/rooms";
import { classMap } from "utils"
import { useAppDispatch } from "redux/hooks";
import {
  addRoom
} from "redux/slices/rooms"
import { useSocket } from "modules/socket";

type Props = {
  isOpen: boolean
  close: () => void
}

const RoomConfigDialog: React.FC<Props> = ({ isOpen, close }) => {

  const [name, setName] = useState("")
  const [hasError, setHasError] = useState(false)

  const form = useRef<HTMLFormElement>(null)

  const { socket } = useSocket()

  const onDefined = () => {
    if (form.current.checkValidity()) {
      close()
      socket.emit("add-room", name)
    } else {
      setHasError(true)
    }
  }

  const onChange = e => {
    setName(e.target.value)
    setHasError(false)
  }

  return (
    <Dialog dialogTitle="Type your room name" isOpen={isOpen} close={close}>
      <form ref={form} className={`form ${classMap({ checked: hasError })}`}>
        <input
          type="text"
          value={name}
          required
          onChange={onChange}
        />
        <div className="action-btns mt-1">
          <button type="button" className="btn" onClick={onDefined}>OK</button>
        </div>
      </form>
    </Dialog>
  )
}

export default RoomConfigDialog
import React, { useRef, useState } from "react";
import Dialog from "components/dialog"
import { classMap } from "utils"
import { useSocket } from "hooks/socket";

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
    <Dialog dialogTitle="ルーム設定" isOpen={isOpen} close={close}>
      <form ref={form} className={`form ${classMap({ checked: hasError })}`}>
        <input
          type="text"
          value={name}
          required
          placeholder="部屋名"
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
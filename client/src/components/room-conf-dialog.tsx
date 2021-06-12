import React, { useRef, useState } from "react";
import Dialog from "components/dialog"
import { classMap } from "utils"
import {createNewRoom} from "api"

type Props = {
  isOpen: boolean
  close: () => void
}

const RoomConfigDialog: React.FC<Props> = ({ isOpen, close }) => {

  const [name, setName] = useState("")
  const [hasError, setHasError] = useState(false)

  const form = useRef<HTMLFormElement>(null)

  const onDefined = () => {
    if (form.current.checkValidity()) {
      close()
      createNewRoom(name).then(room => {
        console.log("room created. ",room)
      })
    } else {
      setHasError(true)
    }
  }

  const onChange = e => {
    setName(e.target.value)
    setHasError(false)
  }

  return (
    <Dialog dialogTitle="ルーム設定" isOpen={isOpen} close={close} closeIfOutsideClick>
      <form ref={form} className={`form ${classMap({ checked: hasError })}`}>
        <div className="field">
          <label htmlFor="roomname" className="field__label">ルーム名</label>
          <input
            id="roomname"
            className="field__input"
            type="text"
            value={name}
            required
            placeholder="ルーム名"
            onChange={onChange}
          />
        </div>
        <div className="action-btns mt-1">
          <button type="button" className="btn" onClick={onDefined}>OK</button>
        </div>
      </form>
    </Dialog>
  )
}

export default RoomConfigDialog
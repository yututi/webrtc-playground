import React, { useRef, useState } from "react";
import { classMap } from "utils"
import { createNewRoom } from "api"
import { useHistory } from "react-router-dom"
import "./new-room.scss"
import B2HBtn from "components/back-to-home-btn";

type Form = {
  roomType: string
}

const rooms = [
  {
    value: "video-chat",
    label: "ビデオチャット"
  },
  {
    value: "video-share",
    label: "画面共有"
  }
]

const NewRoom: React.VFC = () => {

  const nameRef = useRef<HTMLInputElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [roomType, setRoomType] = useState("video-chat")

  const form = useRef<HTMLFormElement>(null)

  const history = useHistory()

  const onDefined = () => {
    if (form.current.checkValidity()) {
      setIsLoading(true)
      createNewRoom(nameRef.current.value).then(room => {
        history.push("/")
      }).finally(() => {
        setIsLoading(false)
      })
    } else {
      setHasError(true)
    }
  }

  return (
    <div className={`card form new-room ${classMap({ checked: hasError })}`}>
      <B2HBtn />
      <form ref={form}>
      <fieldset className="mt-1" disabled={isLoading}>
        <div className="field">
          <label htmlFor="roomname" className="field__label">ルーム名</label>
          <input
            id="roomname"
            className="field__input"
            type="text"
            ref={nameRef}
            required
            placeholder="ルーム名を入力してください"
          />
        </div>
        <div className="field mt-1">
          <label className="field__label">タイプ</label>
          <div className="field__input">
            {rooms.map(room => (
              <div className="field" key={room.value}>
                <input
                  id={room.value}
                  name="room-type"
                  value={room.value}
                  checked={room.value === roomType}
                  type="radio"
                  onChange={e => setRoomType(e.target.value)}
                />
                <label 
                  className="field__label"
                  htmlFor={room.value}
                >
                    {room.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="max" className="field__label mt-1">最大人数</label>
          <input
            id="max"
            className="field__input"
            type="number"
            max="20"
            disabled
            placeholder="作成中"
          />
        </div>
        <div className="action-btns mt-1">
          <button type="button" className="btn" onClick={onDefined}>作成</button>
        </div>
      </fieldset>
      </form>
    </div>
  )
}

type InputType = {
  id: string
  label: string
  name: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const LabeledRadio :React.VFC<InputType> = ({id, label, name, onChange}) => {

  return (
    <div className="field">
      <input
        id={id}
        name={name}
        value={id}
        type="radio"
        placeholder="ルーム名"
        onChange={onChange}
      />
      <label className="field__label" htmlFor={id}>{label}</label>
    </div>
  )
}

export default NewRoom
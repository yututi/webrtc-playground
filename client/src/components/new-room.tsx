import React, { useRef, useState } from "react";
import { classMap } from "utils"
import { createNewRoom } from "api"
import { useHistory } from "react-router-dom"
import "./new-room.scss"
import B2HBtn from "./back-to-home-btn";

const NewRoom: React.VFC = () => {

  const nameRef = useRef<HTMLInputElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useRef<HTMLFormElement>(null)

  const history = useHistory()

  const onDefined = () => {
    if (form.current.checkValidity()) {
      setIsLoading(true)
      createNewRoom(nameRef.current.value).then(room => {
        console.log("room created. ", room)
        history.push("/")
      }).catch(() => {
        setIsLoading(false)
      })
    } else {
      setHasError(true)
    }
  }

  return (
    <form ref={form} className={`card form new-room ${classMap({ checked: hasError })}`}>
      <B2HBtn />
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
            <div className="field">
              <input
                id="video"
                name="room-types"
                type="radio"
                defaultChecked
                placeholder="ルーム名"
              />
              <label className="field__label" htmlFor="video">ビデオチャット</label>
            </div>
            <div className="field">
              <input
                id="text"
                name="room-types"
                type="radio"
                disabled
                placeholder="ルーム名"
              />
              <label className="field__label field__label--is-disable" htmlFor="text">テキストチャット(作成中)</label>
            </div>
            <div className="field">
              <input
                id="video-text"
                name="room-types"
                type="radio"
                disabled
                placeholder="ルーム名"
              />
              <label className="field__label field__label--is-disable" htmlFor="video-text">ビデオ/テキストチャット(作成中)</label>
            </div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="max" className="field__label mt-1">最大人数</label>
          <input
            id="max"
            className="field__input"
            type="text"
            disabled
            placeholder="作成中"
          />
        </div>
        <div className="action-btns mt-1">
          <button type="button" className="btn" onClick={onDefined}>作成</button>
        </div>
      </fieldset>
    </form>
  )
}

const RadioField = () => {

  return (
    <div className="field">
      <input
        id="video-text"
        name="room-types"
        type="radio"
        disabled
        placeholder="ルーム名"
      />
      <label htmlFor="video-text">ビデオ/テキストチャット</label>
    </div>
  )
}

export default NewRoom
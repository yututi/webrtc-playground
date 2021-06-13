
import Dialog from "components/dialog"
import { useState } from "react"
import { useAppSelector, useAppDispatch } from "redux/hooks"
import { setUserName, setTheme } from "redux/slices/global"
import { Theme } from "types"

const MeInfo = () => {

  const userName = useAppSelector(state => state.global.userName)

  return (
    <>
      <div className="user-name">
        {userName}
      </div>
      <UserDialog
        defaultName={userName}
      />
    </>
  )
}

type DialogProps = {
  defaultName: string
}

const UserDialog: React.FC<DialogProps> = ({ defaultName }) => {

  const dispatch = useAppDispatch()

  const [isDefined, setIsDefined] = useState(false)

  const [name, setName] = useState("")

  const onDefined = () => {
    dispatch(setUserName(name || defaultName))
    setIsDefined(true)
  }

  const onThemeChange = (theme: Theme) => () => {
    dispatch(setTheme(theme))
  }

  return (
    <Dialog dialogTitle="ユーザ設定" isOpen={!isDefined}>
      <div className="field">
        <label htmlFor="username" className="field__label">名前</label>
        <input
          id="username"
          type="text"
          className="field__input"
          placeholder={defaultName}
          onBlur={e => setName(e.target.value)}
        />
      </div>
      <div className="field mt-1">
        <label className="field__label">テーマ</label>
        <div className="field__input">
          <button className="light btn" onClick={onThemeChange("light")}>Light</button>
          <button className="dark btn ml-1" onClick={onThemeChange("dark")}>Dark</button>
          <button className="orange btn ml-1" onClick={onThemeChange("orange")}>Orange</button>
        </div>
      </div>
      <div className="action-btns mt-1">
        <button className="btn" onClick={onDefined}>OK</button>
      </div>
    </Dialog>
  )
}

export default MeInfo

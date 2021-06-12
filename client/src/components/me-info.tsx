
import Dialog from "components/dialog"
import { useState } from "react"
import { useAppSelector, useAppDispatch } from "redux/hooks"
import { setUserName } from "redux/slices/global"

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

  return (
    <Dialog dialogTitle="ユーザ名" isOpen={!isDefined}>
      <input type="text" placeholder={defaultName} onBlur={e => setName(e.target.value)} />
      <div className="action-btns mt-1">
        <button className="btn" onClick={onDefined}>OK</button>
      </div>
    </Dialog>
  )
}

export default MeInfo

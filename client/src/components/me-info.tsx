import { useMeContext } from "modules/me"
import Dialog from "components/dialog"
import { useState } from "react"

const MeInfo = () => {

    const { name, setName } = useMeContext()

    return (
        <>
            <div className="user-name">
                {name}
            </div>
            <UserDialog 
                onUserNameDefined={setName} 
                defaultName={name}
            />
        </>
    )
}

type DialogProps = {
    onUserNameDefined: (name: string) => void
    defaultName: string
}

const UserDialog: React.FC<DialogProps> = ({ onUserNameDefined, defaultName }) => {

    const [isDefined, setIsDefined] = useState(false)

    const [name, setName] = useState("")

    const onDefined = () => {
        onUserNameDefined(name || defaultName)
        setIsDefined(true)
    }

    return (
        <Dialog dialogTitle="ユーザ名" isOpen={!isDefined} close={onDefined}>
            <input type="text" placeholder={defaultName} value={name} onChange={e => setName(e.target.value)} />
            <div className="action-btns mt-1">
                <button className="btn" onClick={onDefined}>OK</button>
            </div>
        </Dialog>
    )
}

export default MeInfo

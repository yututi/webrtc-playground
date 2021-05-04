import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { classMap } from "utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import "./dialog.scss"

type Props = {
    isOpen: boolean
    close: () => void
    dialogTitle: string
}

const Dialog: React.FC<Props> = ({ children, isOpen, dialogTitle, close }) => {

    const [isAnimInProg, setIsAnimInProg] = useState(false)

    const modalClass = classMap({
        "modal--is-open": isOpen
    })
    const presentationClass = classMap({
        "presentation--is-open": isOpen
    })

    useEffect(() => {
        setIsAnimInProg(true)
    }, [isOpen])

    const onAnimEnd = () => {
        setIsAnimInProg(false)
    }

    if (isOpen || isAnimInProg) return ReactDOM.createPortal(
        <>
            <div className={`modal ${modalClass}`} onTransitionEnd={onAnimEnd}></div>
            <div className={`presentation ${presentationClass}`}>
                <div className="dialog">
                    <div className="dialog__header">
                        <div className="dialog__title">{dialogTitle}</div>
                        <div className="spacer"></div>
                        <FontAwesomeIcon onClick={close} className="dialog__header-icon" icon={faTimes} />
                    </div>
                    <div className="dialog__body">
                        {children}
                    </div>
                </div>
            </div>
        </>
        ,
        getOrCreateElementDirectlyUnderById("modals")
    )
    else return null
}

const getOrCreateElementDirectlyUnderById = (id) => { // 英語おかしい
    let el = document.getElementById(id)
    if (el) return el
    el = document.createElement("div")
    el.id = id
    document.body.appendChild(el)
    return el
}

export default Dialog

import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { classMap } from "utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import "./dialog.scss"

type Props = {
    isOpen: boolean
    close?: () => void
    dialogTitle: string
}

const Dialog: React.FC<Props> = ({ children, isOpen, dialogTitle, close }) => {

    const [isAnimInProg, setIsAnimInProg] = useState(false)

    const didMount = useRef(false)
    const beforeIsOpen = useRef(isOpen)
    const isOpenStateChanged = beforeIsOpen.current !== isOpen

    const modalClass = classMap({
        "modal--is-open": isOpen && !isOpenStateChanged
    })
    const presentationClass = classMap({
        "presentation--is-open": isOpen && !isOpenStateChanged
    })

    useEffect(() => {
        if (didMount.current) setIsAnimInProg(true)
        else didMount.current = true
        beforeIsOpen.current = isOpen
    }, [isOpen])

    const onAnimEnd = () => {
        setIsAnimInProg(false)
    }

    if (isOpen || isAnimInProg || isOpenStateChanged) return ReactDOM.createPortal(
        <>
            <div className={`modal ${modalClass}`} onTransitionEnd={onAnimEnd}></div>
            <div className={`presentation ${presentationClass}`}>
                <div className="dialog">
                    <div className="dialog__header">
                        <div className="dialog__title">{dialogTitle}</div>
                        <div className="spacer"></div>
                        {close ? <FontAwesomeIcon onClick={close} className="dialog__header-icon" icon={faTimes} /> : ""}
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

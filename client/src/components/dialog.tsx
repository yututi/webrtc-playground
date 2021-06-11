import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { classMap } from "utils"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import "./dialog.scss"
import { useDynamicAnimation } from "utils/custom-hooks"
import IconBtn from "./icon-btn"

type Props = {
  isOpen: boolean
  close?: () => void
  dialogTitle: string
}

const Dialog: React.FC<Props> = ({ children, isOpen, dialogTitle, close }) => {

  const {
    animationDomExists,
    shouldAppendAnimationClass,
    onAnimationEnd
  } = useDynamicAnimation(isOpen)

  const modalClass = classMap({
    "modal--is-open": shouldAppendAnimationClass
  })
  const presentationClass = classMap({
    "presentation--is-open": shouldAppendAnimationClass
  })

  if (animationDomExists) return ReactDOM.createPortal(
    <>
      <div className={`modal ${modalClass}`} onTransitionEnd={onAnimationEnd}></div>
      <div className={`presentation ${presentationClass}`}>
        <div className="dialog component">
          <div className="dialog__header">
            <div className="dialog__title">{dialogTitle}</div>
            <div className="spacer"></div>
            {close ? <IconBtn small iconSize="lg" color="secondary" onClick={close} className="dialog__header-icon" icon={faTimes} reverse /> : ""}
          </div>
          <div className="dialog__body">
            {children}
          </div>
        </div>
      </div>
    </>
    ,
    getOrCreateElementDirectlyUnderRootById("modals")
  )
  else return null
}

const getOrCreateElementDirectlyUnderRootById = (id) => { // 英語おかしい
  let el = document.getElementById(id)
  if (el) return el
  el = document.createElement("div")
  el.id = id
  document.body.appendChild(el)
  return el
}

export default Dialog

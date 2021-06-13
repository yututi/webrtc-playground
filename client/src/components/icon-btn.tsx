import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import "./icon-btn.scss"
import { Color } from "components/types"

type Props = {
  icon: IconProp
  iconSize?: SizeProp
  size?: "sm" | "lg" | "md"
  text?: string
  color?: Color
  reverse?: boolean
  flat?: boolean
}

const IconBtn: React.VFC<Props & JSX.IntrinsicElements['button']> = React.memo((props) => {

  const { 
    icon, 
    text, 
    color = "primart", 
    iconSize = "2x", 
    reverse = false, 
    size = "md", 
    flat = false,
    ...btnProps } = props

  const classes = [
    "icon-btn hl flex is-align-center",
    color,
    reverse && "icon-btn--is-reverse",
    `icon-btn--is-${size}`,
    !!text && "icon-btn--is-square btn",
    flat && "icon-btn--is-flat"
  ].filter(Boolean).join(" ")

  return (
    <button {...btnProps} className={classes}>
      <span><FontAwesomeIcon size={iconSize} icon={icon}></FontAwesomeIcon></span>
      {text && <span className="ml-1">{text}</span>}
    </button>
  )
})

export default IconBtn
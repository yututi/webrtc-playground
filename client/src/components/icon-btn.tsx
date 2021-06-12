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
}

const IconBtn: React.VFC<Props & JSX.IntrinsicElements['button']> = React.memo((props) => {

  const { icon, text, color = "primart", iconSize = "2x", reverse = false, size = "md", ...btnProps } = props

  const classes = [
    "icon-btn hl flex is-align-center",
    color,
    reverse && "icon-btn--is-reverse",
    `icon-btn--is-${size}`
  ].filter(Boolean).join(" ")

  return (
    <button {...btnProps} className={classes}>
      <span><FontAwesomeIcon size={iconSize} icon={icon}></FontAwesomeIcon></span>
      {text}
    </button>
  )
})

export default IconBtn
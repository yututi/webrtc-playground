import React, { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import "./icon-btn.scss"
import { Color } from "components/types"

type Props = {
  icon: IconProp
  iconSize?: SizeProp
  small?: boolean
  text?: string
  color?: Color
  reverse?: boolean
}

const IconBtn: React.VFC<Props & JSX.IntrinsicElements['button']> = React.memo((props) => {

  const { icon, text, color = "primart", iconSize = "2x", reverse = false, small = false, ...btnProps } = props

  const classes = [
    "icon-btn hl flex is-align-center",
    color,
    reverse && "icon-btn--is-reverse",
    small && "icon-btn--is-sm"
  ].filter(Boolean).join(" ")

  return (
    <button {...btnProps} className={classes}>
      <FontAwesomeIcon size={iconSize} icon={icon}></FontAwesomeIcon>
      {text}
    </button>
  )
})

export default IconBtn
import React, { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import "./icon-btn.scss"
import { Color } from "components/types"

type Props = {
    icon: IconProp
    iconSize?: SizeProp
    text?: string
    color?: Color
    reverse?: boolean
}

const IconBtn: React.VFC<Props & JSX.IntrinsicElements['button']> = React.memo((props) => {

    const { icon, text, color = "primart", iconSize = "2x", reverse = false, ...btnProps } = props

    return (
        <button {...btnProps} className={`icon-btn hl flex is-align-center ${color} ${reverse ? "icon-btn--is-reverse" : ""}`}>
            <span style={{ width: "100%", textAlign: "center" }}>
                <FontAwesomeIcon size={iconSize} icon={icon}></FontAwesomeIcon>
            </span>
            {text}
        </button>
    )
})

export default IconBtn
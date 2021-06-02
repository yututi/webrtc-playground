import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import "./icon-btn.scss"
import {Color} from "components/types"

type Props = {
    icon: IconProp
    text?: string
    color?: Color
}

const IconBtn: React.VFC<Props & JSX.IntrinsicElements['button']> = React.memo((props) => {

    const { icon, text, color = "primary", ...btnProps } = props

    return (
        <button {...btnProps} className={`icon-btn hl flex is-align-center ${color}`}>
            <FontAwesomeIcon size="2x" icon={icon}></FontAwesomeIcon>
            {text}
        </button>
    )
})

export default IconBtn
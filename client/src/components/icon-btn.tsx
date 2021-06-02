import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
    icon: IconProp
    text?: string
}

const IconBtn: React.VFC<Props & JSX.IntrinsicElements['button']> = React.memo((props) => {

    const icon = props.icon
    const text = props.text

    return (
        <button {...props} className="icon-btn flex is-align-center">
            <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
            {text}
        </button>
    )
})

export default IconBtn
import React from "react"
import { classMap } from "utils"
import { useDynamicAnimation } from "utils/custom-hooks"
import "./nav.scss"

type Props = {
    isOpen: boolean
    isRightSide?: boolean
    onClose: () => void
}

const Nav: React.FC<Props> = React.memo(({ isOpen, isRightSide = false, onClose, children }) => {

    const {
        animationDomExists,
        shouldAppendAnimationClass,
        onAnimationEnd 
    } = useDynamicAnimation(isOpen)

    const navClass = classMap({
        "is-open": isOpen,
        "is-right": isRightSide
    })

    const modalClass = classMap({
        "modal--is-open": shouldAppendAnimationClass
    })

    return (
        <>
            {animationDomExists && <div className={`modal ${modalClass} hide-on-pc`} onClick={onClose}></div>}
            <nav className={`nav component ${navClass}`} onTransitionEnd={e => e.target === e.currentTarget && onAnimationEnd()}>
                {children}
            </nav>
        </>
    )
})

export default Nav
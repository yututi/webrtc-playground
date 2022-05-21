import React from "react"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import { selectIsNavOpen, toggleNavOpen } from "redux/slices/global"
import { classMap } from "utils"
import { useDynamicAnimation } from "utils/custom-hooks"
import "./nav.scss"

type Props = {
  isRightSide?: boolean
}

const Nav: React.FC<Props> = ({ isRightSide = false, children }) => {

  const isNavOpen = useAppSelector(selectIsNavOpen)

  const dispatch = useAppDispatch()

  const {
    animationDomExists,
    shouldAppendAnimationClass,
    onAnimationEnd
  } = useDynamicAnimation(isNavOpen)

  const navClass = classMap({
    "is-open": isNavOpen,
    "is-right": isRightSide
  })

  const modalClass = classMap({
    "modal--is-open": shouldAppendAnimationClass
  })

  
  const shouldCloseNavOnRoomSelect = useAppSelector(state => state.global.media === "sm")

  const onNavClicked = () => {
    shouldCloseNavOnRoomSelect && dispatch(toggleNavOpen())
  }

  return (
    <>
      {animationDomExists && <div className={`modal ${modalClass} hide-on-pc`} onClick={() => dispatch(toggleNavOpen())}></div>}
      <nav 
        className={`nav component ${navClass}`} 
        onTransitionEnd={e => e.target === e.currentTarget && onAnimationEnd()}
        onClick={onNavClicked}
      >
        {children}
      </nav>
    </>
  )
}

export default Nav
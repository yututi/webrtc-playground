import { useRef, useState, useEffect } from "react"


export const useDynamicAnimation = (isIn: boolean) => {
  const beforeIsOpen = useRef(isIn)
  const isStateChanged = beforeIsOpen.current !== isIn

  const [isAnimInProg, setIsAnimInProg] = useState(false)
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) setIsAnimInProg(true)
    else didMount.current = true
    beforeIsOpen.current = isIn
  }, [isIn])

  return {
    animationDomExists: isStateChanged || isIn || isAnimInProg,
    shouldAppendAnimationClass: !isStateChanged && isIn,
    onAnimationEnd: () => setIsAnimInProg(false)
  }
}
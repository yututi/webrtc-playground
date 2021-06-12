import { useEffect, useRef, useState } from "react"


const useMouseInOut = () => {

  const ref = useRef(null)
  const [isMouseIn, setIsMouseIn] = useState(false)

  useEffect(() => {
    ref.current.addEventListener("mouseenter", () => {
      setIsMouseIn(true)
    })
    ref.current.addEventListener("mouseleave", () => {
      setIsMouseIn(false)
    })
  }, [])

  return {
    ref,
    isMouseIn
  }
}

export default useMouseInOut
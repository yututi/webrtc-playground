import { useEffect, useMemo } from "react"

type MediaChanged = (matched: boolean) => void
type UseMediaChangedArgs = {
  query: string,
  onMediaMatched: MediaChanged
}

const useMediaQuery = ({ query, onMediaMatched }: UseMediaChangedArgs) => {

  const media = useMemo(() => window.matchMedia(query), [query])

  useEffect(() => {
    const mediaChangedListener = e => {
      onMediaMatched(e.matches)
    }
    media.addEventListener("change", mediaChangedListener)
    onMediaMatched(media.matches)

    return () => {
      media.removeEventListener("change", mediaChangedListener)
    }
  }, [onMediaMatched, media])
}

export default useMediaQuery
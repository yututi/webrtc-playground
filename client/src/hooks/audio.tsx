// 唯一のオーディオ要素を扱う

// ※出力先デバイスを管理するのに1要素で管理したほうがよさそうだが、
// そうなると個々のボリューム管理がとてもめんどくさいことになりそう
// https://blog.twoseven.xyz/chrome-webrtc-remote-volume/

// safariがオーディオ出力先デバイスの変更に対応していないのでこのコンポーネントは使わない

import React, { createContext, useEffect, useRef } from "react"
import { useContext } from "react"

type AudioState = React.MutableRefObject<HTMLMediaElement>

const AudioContext = createContext<AudioState>(null)

export const AudioProvider: React.FC = ({ children }) => {

  const audioRef = useRef<HTMLMediaElement>(null)

  useEffect(() => {
    audioRef.current.srcObject = new MediaStream()
  }, [])

  return (
    <>
      <AudioContext.Provider value={audioRef}>{children}</AudioContext.Provider>
      <audio ref={audioRef} autoPlay></audio>
    </>
  )
}

export const useAudio = () => {
  return useContext(AudioContext)
}

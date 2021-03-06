import { Socket } from "socket.io-client"
import { UserWithOffer, CandidateInfo, AnswerInfo } from "types"
import { P2P } from "./P2P"

type P2PApiFacadeArgs = {
  remoteUser: UserWithOffer,
  socket: Socket,
  p2p: P2P,
  localUserName: string,
  onRemoteUserNameChanged: (name: string) => void
}

export default class P2PConnector {

  private socket: Socket

  private p2p: P2P

  private events: { [key: string]: (...args: any[]) => void }

  constructor({
    socket,
    p2p,
    remoteUser,
    localUserName,
    onRemoteUserNameChanged
  }: P2PApiFacadeArgs) {

    this.p2p = p2p

    this.events = {}

    this.p2p.onIceCandidate(candidate => {
      socket.emit("candidate", {
        to: remoteUser.id,
        from: socket.id,
        candidate: JSON.stringify(candidate)
      })
    })

    this.events.candidate = (candidateInfo: CandidateInfo) => {
      console.log("receive candidate", candidateInfo)
      if (candidateInfo.from === remoteUser.id) {
        // connection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
        this.p2p.addCandidate(new RTCIceCandidate(JSON.parse(candidateInfo.candidate)))
      }
    }

    // RTC接続の開始
    // オファーがあればアンサーを返す。
    if (remoteUser.offer) {
      this.p2p.setOfferAndGetAnswer(remoteUser.offer).then(answer => {
        socket.emit("answer", {
          to: remoteUser.id,
          from: socket.id,
          name: localUserName,
          answer: answer
        })
      })
    }

    // オファーがなければオファーを送る
    else {
      this.p2p.createOffer().then(offer => {
        socket.emit("offer", {
          to: remoteUser.id,
          from: socket.id,
          name: localUserName,
          offer: offer
        })
      })

      // リモートからのアンサーを受け取る
      this.events.answer = (answerInfo: AnswerInfo) => {
        console.log("answerInfo", answerInfo, remoteUser)
        // 別のコネクションの返答の可能性があるため、id検証する
        if (remoteUser.id === answerInfo.from) {
          console.log("answered", remoteUser.id)
          this.p2p.setAnswer(new RTCSessionDescription(answerInfo.answer))
          onRemoteUserNameChanged(answerInfo.name)
        }
      }
    }

    Object.entries(this.events).forEach(([name, handler]) => {
      socket.on(name, handler)
    })

    this.socket = socket
  }

  destroy() {
    this.p2p.destroy()
    Object.entries(this.events).forEach(([name, handler]) => {
      this.socket.off(name, handler)
    })
  }
}
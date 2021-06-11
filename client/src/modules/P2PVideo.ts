import { VIDEO } from "modules/const"

// extends interfece of HTMLCanvasElement because captureStream is still draft.
interface CanvasElement extends HTMLCanvasElement {
  captureStream(int): MediaStream;
}
interface MediaStreamAudioDestinationNode extends AudioNode {
  stream: MediaStream;
}
export class P2PVideo {

  private height: number = 0
  private width: number = 0
  private connection: RTCPeerConnection = null
  private remoteStream: MediaStream = new MediaStream()

  private _videoMute: boolean = false
  private _audioMute: boolean = false

  // 下の２つ、一纏めで問題なさそう
  private videoSender: RTCRtpSender
  private audioSender: RTCRtpSender

  get dummyVideoTrack() {
    const canvas = document.createElement("canvas") as CanvasElement
    canvas.width = this.width
    canvas.height = this.height
    canvas.getContext("2d").fillRect(0, 0, this.width, this.height)
    return canvas.captureStream(1).getVideoTracks()[0]
  }

  get dummyAudioTrack() {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const dist = oscillator.connect(ctx.createMediaStreamDestination()) as MediaStreamAudioDestinationNode
    oscillator.start()
    const track = dist.stream.getAudioTracks()[0]
    track.enabled = false
    return track
  }

  constructor(height: number = VIDEO.HEIGHT, width: number = VIDEO.WIDTH) {
    this.height = height
    this.width = width
    this.connection = new RTCPeerConnection({ 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] })
    this.videoSender = this.connection.addTrack(this.dummyVideoTrack)
    this.audioSender = this.connection.addTrack(this.dummyAudioTrack)

    this.connection.addEventListener("track", e => {
      if (e.track) this.remoteStream.addTrack(e.track)
    })
  }

  createOffer() {
    return this.connection.createOffer().then(offer => {
      this.connection.setLocalDescription(offer)
      return offer
    })
  }

  async setOfferAndGetAnswer(offer: RTCSessionDescriptionInit) {
    await this.connection.setRemoteDescription(offer)
    return await this.connection.createAnswer().then(answer => {
      this.connection.setLocalDescription(answer)
      return answer
    })
  }

  setAnswer(answer: RTCSessionDescriptionInit) {
    this.connection.setRemoteDescription(answer)
  }

  onIceCandidate(onIceCandidate: (e: RTCIceCandidate) => void) {
    this.connection.addEventListener("icecandidate", e => {
      if (e.candidate) onIceCandidate(e.candidate)
    })
  }

  addCandidate(candidate: RTCIceCandidate) {
    this.connection.addIceCandidate(candidate)
  }

  setDevice({ videoDeviceId: videoId, audioDeviceId: audioId }: { videoDeviceId?: string, audioDeviceId?: string }) {
    return navigator.mediaDevices.getUserMedia({
      video: !!videoId && {
        deviceId: videoId,
        height: this.height,
        width: this.width
      },
      audio: !!audioId && {
        deviceId: audioId,
        noiseSuppression: true,
        echoCancellation: true
      }
    }).then(stream => {
      stream.getTracks().forEach(track => {
        if (this.videoSender.track.kind === track.kind) {
          track.enabled = !this.videoMute
          this.videoSender.replaceTrack(track)
        }
        if (this.audioSender.track.kind === track.kind) {
          track.enabled = !this.audioMute
          this.audioSender.replaceTrack(track)
        }
      })
    })
  }

  set videoMute(mute: boolean) {
    this._videoMute = mute
    if (this.videoSender) {
      this.videoSender.track.enabled = !mute
    }
  }
  get videoMute() {
    return this._videoMute
  }
  set audioMute(mute: boolean) {
    this._audioMute = mute
    if (this.audioSender) {
      this.audioSender.track.enabled = !mute
    }
  }
  get audioMute() {
    return this._audioMute
  }

  get stream() {
    return this.remoteStream
  }

  destroy() {
    this.connection.close()
  }

  get isConnected() {
    return this.connection.connectionState === "connected"
  }
}
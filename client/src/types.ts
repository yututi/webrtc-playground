import P2PApiFacade from "modules/P2PApiFacade"

export type UserWithOffer = {
  id: string
  name: string
  offer?: RTCSessionDescriptionInit
}
export type User = {
  id: string
  name: string
}
export type Room = {
  name: string
  users: number
}
export type UserWithRoom = {
  // room name
  room: string
  // user id
  id: string
}
export type CandidateInfo = {
  from: string
  candidate: string
}
export type AnswerInfo = {
  from: string
  name: string
  answer: RTCSessionDescriptionInit
}
export type UserWithP2PInfo = {
  id: string
  name: string
  p2p: P2PApiFacade
}
export type OfferInfo = {
  from: string
  offer?: RTCSessionDescriptionInit
  name: string
}
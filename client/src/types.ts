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
  users: User[]
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
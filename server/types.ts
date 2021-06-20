
export type UserWithOffer = {
  id: string
  name: string
  offer?: RTCSessionDescriptionInit
}
export type User = {
  id: string
  name: string
  roomId?: string
}
export type UserStateChangedEvent = {
  type: "create" | "update" | "delete"
  user: User
}
export type Room = {
  id: string
  name: string
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
export type OfferInfo = {
  from: string
  offer?: RTCSessionDescriptionInit
  name: string
}
export type Theme = "light" | "dark" | "orange"
export type Media = "sp" | "pc"
export type UserAndRoom = {
  rooms: Room[],
  users: User[]
}
export type ErrorResponse = {
  message: string
}
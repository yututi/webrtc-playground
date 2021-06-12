
import { Room, User } from "./types"
import { v4 } from "uuid"

// In memory repository for Rooms and Users

const idToRooms: { [key: string]: Room } = {}
const roomIdToUsers: { [key: string]: User[] } = {}
const userIdToRoomId: { [key: string]: string } = {}
const userIdToUser: { [key: string]: User } = {}

export const listRoom = () => {
  return Object.values(idToRooms)
}

export const createRoom = (roomName: string): Room => {
  const id = v4()
  return idToRooms[id] = {
    id,
    name: roomName,
    numberOfPeople: 0
  }
}

export const deleteRoom = (roomId: string) => {
  delete roomIdToUsers[roomId]
  delete idToRooms[roomId]
}

export const joinRoom = (roomId: string, userId: string): boolean => {
  if (!roomIdToUsers[roomId] || !userIdToUser[userId]) {
    return false
  }

  roomIdToUsers[roomId].push(
    userIdToUser[userId]
  )
  userIdToRoomId[userId] = roomId

  return true
}

export const leaveRoom = (roomId: string, userId: string) => {
  if (!roomIdToUsers[roomId] || !userIdToUser[userId]) {
    return false
  }
  delete userIdToRoomId[userId]
  const users = roomIdToUsers[roomId]
  users.splice(users.findIndex(user => user.id === userId), 1)
  return true
}

export const createUser = (userId: string, userName: string) => {
  userIdToUser[userId] = {
    id: userId,
    name: userName
  }
}

export const removeUser = (userId: string) => {
  if(userIdToRoomId[userId]) {
    leaveRoom(userIdToRoomId[userId], userId)
  }
  delete userIdToUser[userId]
}

export const getUserById = (userId: string) => {
  return userIdToUser[userId]
}

export const getRoomById = (roomId: string) => {
  return idToRooms[roomId]
}
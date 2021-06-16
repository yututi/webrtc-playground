import userRepository from "./user"
import { v4 } from "uuid"

type Room = {
  id: string
  name: string
}

class RoomRepository {
  private rooms: Room[] = []

  createRoom(roomName: string) : Room {
    const room = {
      id: v4(),
      name: roomName
    }
    this.rooms.push(room)
    return room
  }

  listRooms() {
    return this.rooms
  }

  getRoomById(roomId) {
    return this.rooms.find(room => room.id === roomId)
  }

  removeRoom(roomId: string) {
    this.rooms = this.rooms.filter(room => room.id === roomId)
    userRepository.leaveUsersByRoomId(roomId)
  }

  joinRoom(roomId: string, userId: string) {
    userRepository.setRoom(userId, roomId)
  }

  leaveRoom(roomId, userId) {
    userRepository.setRoom(userId, null)
  }
}

export default new RoomRepository()
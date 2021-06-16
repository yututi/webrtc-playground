import { get, post, deletee } from "utils"
import { Room, User, UserAndRoom } from "types"

export const getRooms = (): Promise<UserAndRoom> => {
  return get("api/rooms")
    .then(res => res.json())
}

export const getRoomDetailById = (id: string): Promise<{ room: Room, users: User[] }> => {
  return get(`api/rooms/${id}/users`).then(res => res.json())
}

export const createNewRoom = (name: string): Promise<Room> => {
  return post(`api/newRoomByName/${name}`).then(res => res.json())
}

export const deleteRoom = (id: string) => {
  return deletee(`api/rooms/${id}`)
}
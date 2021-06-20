import { get, post, deletee } from "utils"
import { Room, User, UserAndRoom } from "types"
import {store} from "redux/store"
import { addErrorMessage } from "redux/slices/messages"

const handleResponse = (response:Response) => {
  if(response.ok) {
    return response.json()
  } else {
    return response.json().then(data => store.dispatch(addErrorMessage(data.message)))
  }
}

export const getRooms = (): Promise<UserAndRoom> => {
  return get("api/rooms")
    .then(handleResponse)
}

export const getRoomDetailById = (id: string): Promise<{ room: Room, users: User[] }> => {
  return get(`api/rooms/${id}/users`).then(handleResponse)
}

export const createNewRoom = (name: string): Promise<Room> => {
  return post(`api/newRoomByName/${name}`).then(handleResponse)
}

export const deleteRoom = (id: string) => {
  return deletee(`api/rooms/${id}`)
}

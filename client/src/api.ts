import { get, post, deletee } from "utils"
import { Room, User, UserAndRoom } from "types"
import { store } from "redux/store"
import { addErrorMessage } from "redux/slices/messages"

const handleResponse = (response: Response) => {
  const stat = Math.floor(response.status % 100)
  if (stat !== 4 && stat !== 5) {
    return response.json()
  } else {
    return response.json().then(data => {
      console.log(data)
      store.dispatch(addErrorMessage(data.message))
      return data
    })
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

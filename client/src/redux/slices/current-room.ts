import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"
import { UserWithOffer} from "types"

export interface CurrentRoomState {
  roomName: string
  users: UserWithOffer[]
}

const initialState: CurrentRoomState = {
  users: [],
  roomName: "",
}

type IdName = {
  id: string,
  name: string
}

export const currentRoomSlice = createSlice({
  name: "currentRoom",
  initialState,
  reducers: {
    joinRoom: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload
    },
    leaveRoom: (state) => {
      state.roomName = ""
      state.users = []
    },
    addUser: (state, action: PayloadAction<UserWithOffer>) => {
      state.users.push(action.payload)
    },
    addUsers: (state, action: PayloadAction<UserWithOffer[]>) => {
      state.users = [
        ...state.users,
        ...action.payload
      ]
      console.log("state.users", state.users)
      console.log("action.payload", action.payload)
    },
    removeUserById: (state, action: PayloadAction<string>) => {
      state.users.splice(state.users.findIndex(user => user.id === action.payload), 1)
    },
    updateUserNameById: (state, action: PayloadAction<IdName>) => {
      const user = state.users.find(user => user.id === action.payload.id)
      user.name = action.payload.id
    },
  }
})

export const {
  addUser,
  removeUserById,
  leaveRoom,
  addUsers,
  updateUserNameById,
  joinRoom
} = currentRoomSlice.actions

export const currentRooms = (state: RootState) => state.currentRoom

export const selectIsRoomJoined = (state: RootState) => !!state.currentRoom.roomName

export default currentRoomSlice.reducer

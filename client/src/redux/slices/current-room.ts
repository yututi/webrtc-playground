import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"
import { UserWithOffer } from "types"

export interface CurrentRoomState {
  isJoined: boolean
  roomName: string
  users: UserWithOffer[]
}

const initialState: CurrentRoomState = {
  isJoined: false,
  users: [],
  roomName: ""
}

export const currentRoomSlice = createSlice({
  name: "currentRoom",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserWithOffer>) => {
      state.users.push(action.payload)
    },
    removeUserById: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id === action.payload)
    },
  }
})

export const {
  addUser,
  removeUserById
} = currentRoomSlice.actions

export const currentRooms = (state: RootState) => state.currentRoom

export default currentRoomSlice.reducer

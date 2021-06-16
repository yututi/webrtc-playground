import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "redux/store"
import { Room, User } from "types"

// 部屋とユーザの状態管理を行う
// ユーザについては部屋に所属していないユーザも管理している

export interface RoomsState {
  rooms: Room[]
  users: User[]
}

const initialState: RoomsState = {
  rooms: [],
  users: []
}

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addRoom: (state, actions: PayloadAction<Room>) => {
      state.rooms.push(actions.payload)
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload
      // state.roomIdToRoom = mapRoom(state.rooms)
    },
    removeRoom: (state, actions: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.id === actions.payload)
      // state.roomIdToRoom = mapRoom(state.rooms)
    },
    addUser: (state, actions: PayloadAction<User>) => {
      console.log({ actions })
      state.users.push(actions.payload)
      // state.UserIdToUser = mapUser(state.Users)
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
      // state.UserIdToUser = mapUser(state.Users)
    },
    removeUser: (state, actions: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== actions.payload)
      // state.UserIdToUser = mapUser(state.Users)
    },
    updateUserState: (state, {payload}: PayloadAction<User>) => {
      state.users.splice(state.users.findIndex(user => user.id === payload.id), 1, payload)
    }, 
  }
})

export const {
  addRoom,
  removeRoom,
  setRooms,
  addUser,
  removeUser,
  setUsers,
  updateUserState
} = roomsSlice.actions

export const selectRooms = (state: RootState) => state.rooms.rooms

export const selectUsersByRoomId = (roomId: string) => (state: RootState) => state.rooms.users.filter(user => user.roomId === roomId)

export default roomsSlice.reducer

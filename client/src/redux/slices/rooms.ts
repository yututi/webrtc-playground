import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"
import { User, Room } from "types"

export interface RoomsState {
  rooms: Room[]
  roomIdToRoom: { [key: string]: string }
}

const initialState: RoomsState = {
  rooms: [],
  roomIdToRoom: {}
}

const mapRoom = (rooms: Room[]) => {
  return rooms.reduce((map, room) => {
    return map[room.name] = room
  }, {})
}

type UserWithRoom = {
  user: User
  room: string
}

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addUser: (state, actions: PayloadAction<UserWithRoom>) => {
      const room = state.rooms.find(room => room.name === actions.payload.room)
      room.users.push(actions.payload.user)
    },
    removeUser: (state, actions: PayloadAction<UserWithRoom>) => {
      const room = state.rooms.find(room => room.name === actions.payload.room)
      room.users = room.users.filter(user => user.id !== actions.payload.user.id)
    },
    addRoom: (state, actions: PayloadAction<string>) => {
      state.rooms.push({
        name: actions.payload,
        users: []
      })
      state.roomIdToRoom = mapRoom(state.rooms)
    },
    removeRoom: (state, actions: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.name === actions.payload)
      state.roomIdToRoom = mapRoom(state.rooms)
    }
  }
})

export const {
  addRoom,
  addUser,
  removeRoom,
  removeUser
} = roomsSlice.actions

export const selectRooms = (state: RootState) => state.room

export default roomsSlice.reducer

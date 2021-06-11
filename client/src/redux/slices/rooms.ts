import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "redux/store"
import { Room, UserWithRoom } from "types"

export interface RoomsState {
  rooms: Room[]
}

const initialState: RoomsState = {
  rooms: []
}

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addUser: (state, actions: PayloadAction<UserWithRoom>) => {
      const room = state.rooms.find(room => room.name === actions.payload.room)
      room.users ++
    },
    removeUser: (state, actions: PayloadAction<UserWithRoom>) => {
      console.log({actions})
      const room = state.rooms.find(room => room.name === actions.payload.room)
      console.log({room})
      room.users --
    },
    addRoom: (state, actions: PayloadAction<Room>) => {
      console.log({actions})
      if (!actions.payload.users) actions.payload.users = 0
      state.rooms.push(actions.payload)
      // state.roomIdToRoom = mapRoom(state.rooms)
    },
    removeRoom: (state, actions: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.name === actions.payload)
      // state.roomIdToRoom = mapRoom(state.rooms)
    }
  }
})

export const {
  addRoom,
  addUser,
  removeRoom,
  removeUser
} = roomsSlice.actions

export const selectRooms = (state: RootState) => state.rooms.rooms


export default roomsSlice.reducer

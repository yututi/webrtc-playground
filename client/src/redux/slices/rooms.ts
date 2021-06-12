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
      console.log({actions})
      const room = state.rooms.find(room => room.id === actions.payload.room)
      room.numberOfPeople ++
    },
    removeUser: (state, actions: PayloadAction<UserWithRoom>) => {
      console.log({actions})
      const room = state.rooms.find(room => room.id === actions.payload.room)
      console.log({room})
      room.numberOfPeople --
    },
    addRoom: (state, actions: PayloadAction<Room>) => {
      console.log({actions})
      if (!actions.payload.numberOfPeople) actions.payload.numberOfPeople = 0
      state.rooms.push(actions.payload)
      // state.roomIdToRoom = mapRoom(state.rooms)
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload
      // state.roomIdToRoom = mapRoom(state.rooms)
    },
    removeRoom: (state, actions: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.id === actions.payload)
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

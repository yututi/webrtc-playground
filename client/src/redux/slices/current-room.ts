import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"
import { UserWithOffer, Room } from "types"

// TODO roomがpathパラメータとreduxの2重管理になっている
export interface CurrentRoomState {
  room: Room
  users: UserWithOffer[]
  isOwnVideoOpen: boolean
}

const initialState: CurrentRoomState = {
  users: [],
  room: null,
  isOwnVideoOpen: false
}

type IdName = {
  id: string,
  name: string
}

export const currentRoomSlice = createSlice({
  name: "currentRoom",
  initialState,
  reducers: {
    joinRoom: (state, action: PayloadAction<Room>) => {
      state.room = action.payload
    },
    leaveRoom: (state) => {
      state.room = null
      state.users = []
    },
    addUser: (state, action: PayloadAction<UserWithOffer>) => {
      state.users.push(action.payload)
    },
    setUsers: (state, action: PayloadAction<UserWithOffer[]>) => {
      state.users = [
        ...action.payload
      ]
    },
    removeUserById: (state, action: PayloadAction<string>) => {
      state.users.splice(state.users.findIndex(user => user.id === action.payload), 1)
    },
    updateUserNameById: (state, action: PayloadAction<IdName>) => {
      const user = state.users.find(user => user.id === action.payload.id)
      user.name = action.payload.id
    },
    toggleOwnVideo:  (state) => {
      state.isOwnVideoOpen = !state.isOwnVideoOpen
    },
  }
})

export const {
  removeUserById,
  leaveRoom,
  setUsers,
  updateUserNameById,
  joinRoom,
  toggleOwnVideo,
  addUser
} = currentRoomSlice.actions

export const currentRooms = (state: RootState) => state.currentRoom

export const setUsersWithoutMyOwn = (users: UserWithOffer[]): AppThunk => (
  dispatch,
  getState
) => {
  const id = getState().global.userId
  dispatch(setUsers(users.filter(user => user.id !== id)))
};


export default currentRoomSlice.reducer

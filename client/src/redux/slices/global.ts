import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Socket, io } from 'socket.io-client'
import { RootState, AppThunk } from "redux/store"
import { isDevelopment, isMobile } from "utils"

const HOST = isDevelopment ? `ws://localhost:5000` : window.location

export interface RoomsState {
  status: "idle" | "loading"
  errors: string[]
  userName: string
  socket: Socket,
  isNavOpen: boolean
}

const initialState: RoomsState = {
  status: "idle",
  errors: [],
  userName: "Guest",
  socket: null,
  isNavOpen: !isMobile
}

export const slice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? "loading" : "idle"
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    toggleNavOpen: (state, action: PayloadAction<void>) => {
      state.isNavOpen = !state.isNavOpen
    },
  }
})
export const {
  setLoading,
  toggleNavOpen,
  setUserName
} = slice.actions

export const selectIsLoading = (state: RootState) => state.global.status === "loading"
export const selectUserName = (state: RootState) => state.global.userName
export const selectIsNavOpen = (state: RootState) => state.global.isNavOpen

export default slice.reducer
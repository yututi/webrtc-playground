import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "redux/store"
import { isMobile } from "utils"

export interface RoomsState {
  status: "idle" | "loading"
  errors: string[]
  userId: string // socket.ioから払いだされるソケットID
  userName: string
  isUserNameDefined: boolean,
  isNavOpen: boolean
}

const initialState: RoomsState = {
  status: "idle",
  errors: [],
  userId: null,
  userName: "Guest",
  isUserNameDefined: false,
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
      state.isUserNameDefined = true
      state.userName = action.payload
    },
    toggleNavOpen: (state, action: PayloadAction<void>) => {
      state.isNavOpen = !state.isNavOpen
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
  }
})
export const {
  setLoading,
  toggleNavOpen,
  setUserName,
  setUserId
} = slice.actions

export const selectIsLoading = (state: RootState) => state.global.status === "loading"
export const selectUserName = (state: RootState) => state.global.userName
export const selectIsNavOpen = (state: RootState) => state.global.isNavOpen

export default slice.reducer
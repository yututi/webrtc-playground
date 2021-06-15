import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "redux/store"
import { isMobile } from "utils"
import { Theme, Media } from "types"

export interface GlobalState {
  status: "idle" | "loading"
  errors: string[]
  userId: string // socket.ioから払いだされるソケットID
  userName: string
  isUserNameDefined: boolean,
  isNavOpen: boolean
  theme: Theme,
  media: Media
}

const initialState: GlobalState = {
  status: "idle",
  errors: [],
  userId: null,
  userName: "Guest",
  isUserNameDefined: false,
  isNavOpen: !isMobile,
  theme: "light",
  media: null
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
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    setMedia: (state, action: PayloadAction<Media>) => {
      state.media = action.payload
    },
  }
})
export const {
  setLoading,
  toggleNavOpen,
  setUserName,
  setUserId,
  setTheme,
  setMedia
} = slice.actions

export const selectIsLoading = (state: RootState) => state.global.status === "loading"
export const selectUserName = (state: RootState) => state.global.userName
export const selectIsNavOpen = (state: RootState) => state.global.isNavOpen

export default slice.reducer
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"

export interface RoomsState {
  status: "idle" | "loading"
  errors: string[]
  userName: string
}

const initialState: RoomsState = {
  status: "idle",
  errors: [],
  userName: ""
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
  }
})
export const {
  setLoading
} = slice.actions

export const selectIsLoading = (state: RootState) => state.global.status === "loading"
export const selectUserName = (state: RootState) => state.global.userName

export default slice.reducer
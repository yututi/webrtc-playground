import {
  configureStore,
  ThunkAction,
  Action
} from '@reduxjs/toolkit'
import roomReducer from "redux/slices/rooms"
import globalReducer from "redux/slices/global"
import devicesReducer from "redux/slices/devices"
import currentRoomReducer from "redux/slices/current-room"

export const store = configureStore({
  reducer: {
    global: globalReducer,
    room: roomReducer,
    currentRoom: currentRoomReducer,
    devices: devicesReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

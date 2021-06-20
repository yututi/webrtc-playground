import {
  configureStore,
  ThunkAction,
  Action
} from '@reduxjs/toolkit'
import roomsReducer from "redux/slices/rooms"
import globalReducer from "redux/slices/global"
import devicesReducer from "redux/slices/devices"
import currentRoomReducer from "redux/slices/current-room"
import messageResucer from "redux/slices/messages"

export const store = configureStore({
  reducer: {
    global: globalReducer,
    rooms: roomsReducer,
    currentRoom: currentRoomReducer,
    devices: devicesReducer,
    message: messageResucer
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

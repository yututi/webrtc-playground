import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"

/**
 * 使用する入出力機器、ミュート状態の管理
 */

type AvailableDeviceInfo = {
  videos: MediaDeviceInfo[],
  audioIns: MediaDeviceInfo[],
  audioOuts: MediaDeviceInfo[]
}

export interface DeviceState {
  currentVideoId: string
  currentAudioInId: string
  currentAudioOutId: string
  isVideoMute: boolean
  isAudioMute: boolean
  isDeviceAccessPermitetd: boolean
  availableDevices: AvailableDeviceInfo

}

const initialState: DeviceState = {
  currentVideoId: "default",
  currentAudioInId: "default",
  currentAudioOutId: "default",
  isVideoMute: true,
  isAudioMute: true,
  isDeviceAccessPermitetd: false,
  availableDevices: {
    videos: [],
    audioIns: [],
    audioOuts: []
  }
}

export const slice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setVideo: (state, action: PayloadAction<MediaDeviceInfo>) => {
      state.currentVideoId = action.payload.deviceId
    },
    setAudioIn: (state, action: PayloadAction<MediaDeviceInfo>) => {
      state.currentAudioInId = action.payload.deviceId
    },
    setAudioOut: (state, action: PayloadAction<MediaDeviceInfo>) => {
      state.currentAudioOutId = action.payload.deviceId
    },
    setVideoMute: (state, action: PayloadAction<boolean>) => {
      state.isVideoMute = action.payload
    },
    setAudioMute: (state, action: PayloadAction<boolean>) => {
      state.isAudioMute = action.payload
    },
    setDeviceAccessPermit: (state, action: PayloadAction<boolean>) => {
      state.isDeviceAccessPermitetd = action.payload
    },
    setAvailableDevices: (state, action: PayloadAction<AvailableDeviceInfo>) => {
      state.availableDevices = action.payload
    },
  }
})

export const {
  setAudioIn,
  setAudioOut,
  setVideo,
  setDeviceAccessPermit,
  setAudioMute,
  setVideoMute,
  setAvailableDevices
} = slice.actions

export const selectDevice = (state: RootState) => state.devices

export const updateDevices = (): AppThunk => (
  dispatch
) => {
  navigator.mediaDevices.enumerateDevices().then(devices => {
    const _devices = devices.reduce((deviceAcc, device) => {
      if (device.kind === "videoinput") {
        deviceAcc.videos.push(device)
      }
      if (device.kind === "audioinput") {
        deviceAcc.audioIns.push(device)
      }
      if (device.kind === "audiooutput") {
        deviceAcc.audioOuts.push(device)
      }
      return deviceAcc
    }, {
      videos: [],
      audioIns: [],
      audioOuts: []
    })
    dispatch(setAvailableDevices(_devices))
  })
}

export const initDevices = (): AppThunk => (
  dispatch,
  getState
) => {
  if (!getState().devices.isDeviceAccessPermitetd) {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(() => {
      dispatch(setDeviceAccessPermit(true))
    }).catch(e => {
      dispatch(setDeviceAccessPermit(false))
    })
  }
}

export default slice.reducer
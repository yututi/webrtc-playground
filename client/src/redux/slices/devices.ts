import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from "redux/store"

/**
 * 使用する入出力機器、ミュート状態の管理
 */

// MediaDeviceInfoはnon-serializableなので
export type SerializableDeviceInfo = {
  deviceId: string
  label: string
  type: string
}

type AvailableSerializableDeviceInfo = {
  videos: SerializableDeviceInfo[],
  audioIns: SerializableDeviceInfo[]
}

export interface DeviceState {
  current: {
    videoId: string
    audioInId: string
    // audioOutId: string // 出力先変更はOS側でやってもらう
    isVideoMute: boolean
    isAudioMute: boolean
  }
  permission: {
    isVideoPermitted: boolean
    isAudioPermitted: boolean
  }
  availableDevices: AvailableSerializableDeviceInfo
}

const initialState: DeviceState = {
  current: {
    videoId: "default",
    audioInId: "default",
    // audioOutId: "default",
    isVideoMute: true,
    isAudioMute: true
  },
  permission: {
    isAudioPermitted: false,
    isVideoPermitted: false
  },
  availableDevices: {
    videos: [],
    audioIns: []
  }
}

const toSerializable = (device: MediaDeviceInfo): SerializableDeviceInfo => {
  return device.toJSON()
}

export const slice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setVideo: (state, action: PayloadAction<SerializableDeviceInfo>) => {
      state.current.videoId = action.payload.deviceId
    },
    setAudioIn: (state, action: PayloadAction<SerializableDeviceInfo>) => {
      state.current.audioInId = action.payload.deviceId
    },
    // setAudioOut: (state, action: PayloadAction<SerializableDeviceInfo>) => {
    //   state.current.audioOutId = action.payload.deviceId
    // },
    setVideoMute: (state, action: PayloadAction<boolean>) => {
      state.current.isVideoMute = action.payload
    },
    setAudioMute: (state, action: PayloadAction<boolean>) => {
      state.current.isAudioMute = action.payload
    },
    setVideoAccessPermit: (state, action: PayloadAction<boolean>) => {
      state.permission.isVideoPermitted = action.payload
    },
    setAudioAccessPermit: (state, action: PayloadAction<boolean>) => {
      state.permission.isAudioPermitted = action.payload
    },
    setAvailableDevices: (state, action: PayloadAction<AvailableSerializableDeviceInfo>) => {
      state.availableDevices = {
        audioIns: action.payload.audioIns,
        videos: action.payload.videos
      }
    },
  }
})

export const {
  setAudioIn,
  // setAudioOut,
  setVideo,
  setVideoAccessPermit,
  setAudioAccessPermit,
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
        deviceAcc.videos.push(toSerializable(device))
      }
      if (device.kind === "audioinput") {
        deviceAcc.audioIns.push(toSerializable(device))
      }
      return deviceAcc
    }, {
      videos: [],
      audioIns: []
    } as AvailableSerializableDeviceInfo)
    dispatch(setAvailableDevices(_devices))
  })
}

export const initDevices = (): AppThunk<Promise<any>> => (
  dispatch
) => {
  return Promise.all([
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      dispatch(setVideoAccessPermit(true))
    }).catch(() => {
      dispatch(setVideoAccessPermit(false))
    }),
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      dispatch(setAudioAccessPermit(true))
    }).catch(() => {
      dispatch(setAudioAccessPermit(false))
    })
  ]).finally(() => {
    dispatch(updateDevices())
  })
}

export const getExactVideoId = (): AppThunk => (
  dispatch,
  getState
) => {
  const {
    availableDevices: {
      videos
    },
    current: {
      videoId
    }
  } = getState().devices

  if (videos.some(video => video.deviceId === videoId)) {
    return videoId
  } else {
    return null
  }
}

export default slice.reducer
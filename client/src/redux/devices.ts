

export const SET_CURRENT_VIDEO = "set"
export const SET_CURRENT_AUDIO_IN = "set_audio_in"
export const SET_CURRENT_AUDIO_OUT = "set_audio_out"

export const setCurrentVideo = (deviceId: string) => {
    return {
        type: SET_CURRENT_VIDEO,
        payload: deviceId
    }
}
export const setCurrentAudioIn = (deviceId: string) => {
    return {
        type: SET_CURRENT_AUDIO_IN,
        payload: deviceId
    }
}
export const setCurrentAudioOut = (deviceId: string) => {
    return {
        type: SET_CURRENT_AUDIO_OUT,
        payload: deviceId
    }
}

type DeviceState = {
    videoId: string
    audioInId: string
    audioOutId: string
}
const initialState: DeviceState = {
    videoId: null,
    audioInId: null,
    audioOutId: null
}

const user = (state: DeviceState = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_VIDEO:
            return {
                ...state,
                videoId: action
            }
        case SET_CURRENT_AUDIO_IN:
        case SET_CURRENT_AUDIO_OUT:
        default:
            return state;
    }
}

export default user;
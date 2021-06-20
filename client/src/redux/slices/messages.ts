import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type MessageData = {
  id: string,
  type: "info" | "error"
  text: string
}

export interface MessageState {
  messageData: MessageData[]
}

const initialState: MessageState = {
  messageData: []
}

let _id = 0
const newId = () => {
  return `msg_${_id++}`
}

export const slice = createSlice({
  name: "Message",
  initialState,
  reducers: {
    addInfoMessage: (state, { payload }: PayloadAction<string>) => {
      const msg = {
        id: newId(),
        type: "info",
        text: payload
      } as const
      state.messageData.push(msg)
    },
    addErrorMessage: (state, { payload }: PayloadAction<string>) => {
      state.messageData.push({
        id: newId(),
        type: "error",
        text: payload
      })
    },
    removeMessage: (state, { payload }: PayloadAction<string>) => {
      state.messageData = state.messageData.filter(data => data.id !== payload)
    },
  }
})

export const {
  addErrorMessage,
  addInfoMessage,
  removeMessage
} = slice.actions

export default slice.reducer
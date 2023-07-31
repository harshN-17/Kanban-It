import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: true }

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.value = !state.value
    }
  }
})

export const { setMode } = modeSlice.actions

export default modeSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: true }

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setLoader } = loaderSlice.actions

export default loaderSlice.reducer
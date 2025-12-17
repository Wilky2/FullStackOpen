import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setMessage(_state, action){
      return action.payload
    },
    resetMessage(_state, _action){
      return ''
    }
  }
})

const { setMessage, resetMessage } = notificationSlice.actions

export const setNotification = (message, timeout) => {
  return (dispatch) => {
    dispatch(setMessage(message))
    setTimeout(() => {
      dispatch(resetMessage())
    }, timeout*1000)
  }
}

export default notificationSlice.reducer
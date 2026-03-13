export const notificationSliceParameter = (name) => ({
  name,
  initialState: null,
  reducers: {
    setMessage(_state, action) {
      return action.payload;
    },
    resetMessage(_state, _action) {
      return null;
    },
  },
});

export const setNotification = (setMessage, resetMessage) => {
  return (message, timeout) => {
    return (dispatch) => {
      dispatch(setMessage(message));
      setTimeout(() => {
        dispatch(resetMessage());
      }, timeout * 1000);
    };
  };
};

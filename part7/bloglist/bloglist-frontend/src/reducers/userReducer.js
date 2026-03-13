import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";
import { setErrorNotification } from "./errorNotificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    setUsers(_state, action) {
      return action.payload;
    },
  },
});

const { setUsers } = userSlice.actions;

export const loadUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      dispatch(
        setErrorNotification(
          `The users’ information could not be loaded due to a server error.`,
          5,
        ),
      );
    }
  };
};

export default userSlice.reducer;

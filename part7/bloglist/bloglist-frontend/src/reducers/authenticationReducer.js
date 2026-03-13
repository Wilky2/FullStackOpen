import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { setErrorNotification } from "./errorNotificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(_state, action) {
      const user = action.payload;
      return user;
    },
    removeUser(_state, _action) {
      return null;
    },
  },
});

const { setUser, removeUser } = userSlice.actions;

export const loadAuthenticateUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  };
};

export const login = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.clear();
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
    } catch (error) {
      if (error.response.status === 500) {
        dispatch(setErrorNotification(`Login failed due to a server error`, 5));
        return;
      }
      dispatch(setErrorNotification("wrong username or passsword", 5));
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    window.localStorage.clear();
    dispatch(removeUser());
  };
};

export default userSlice.reducer;

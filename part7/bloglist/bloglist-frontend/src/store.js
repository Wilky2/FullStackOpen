import errorNotificationReducer from "./reducers/errorNotificationReducer";
import successNotificationReducer from "./reducers/successNotificationReducer";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./reducers/blogReducer";
import authenticationReducer from "./reducers/authenticationReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    successNotification: successNotificationReducer,
    errorNotification: errorNotificationReducer,
    blogs: blogReducer,
    loginUser: authenticationReducer,
    users: userReducer,
  },
});

export default store;

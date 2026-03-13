import { createSlice } from "@reduxjs/toolkit";
import { notificationSliceParameter } from "./notificationSliceParameter";
import { setNotification } from "./notificationSliceParameter";

const successNotificationSlice = createSlice(
  notificationSliceParameter("success"),
);

const { setMessage, resetMessage } = successNotificationSlice.actions;

export const setSuccessNotification = setNotification(setMessage, resetMessage);

export default successNotificationSlice.reducer;

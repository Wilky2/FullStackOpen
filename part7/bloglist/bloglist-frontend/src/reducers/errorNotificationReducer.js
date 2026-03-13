import { createSlice } from "@reduxjs/toolkit";
import { notificationSliceParameter } from "./notificationSliceParameter";
import { setNotification } from "./notificationSliceParameter";

const errorNotificationSlice = createSlice(notificationSliceParameter("error"));

const { setMessage, resetMessage } = errorNotificationSlice.actions;

export const setErrorNotification = setNotification(setMessage, resetMessage);

export default errorNotificationSlice.reducer;

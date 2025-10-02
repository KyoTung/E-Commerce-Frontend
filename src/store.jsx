import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./features/authSlice/authSlice";
import userReducer from "./features/guestSlice/userSlice"

export const store = configureStore({
    reducer:{auth: authReducer, user: userReducer, }
})
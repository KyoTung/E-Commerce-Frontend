import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./features/authSlice/authSlice";
import userReducer from "./features/guestSlice/userSlice";
import customerReducer from "./features/adminSlice/customerSlice/customerSlice";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        user: userReducer,
        customer: customerReducer,
    
    }
})
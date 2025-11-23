import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice/authSlice";
import userReducer from "./features/guestSlice/userSlice";
import customerReducer from "./features/adminSlice/customerSlice/customerSlice";
import categoryReducer from "./features/adminSlice/category/categorySlice";
import brandReducer from "./features/adminSlice/brand/brandSlice";
import colorReducer from "./features/adminSlice/color/colorSlice";
import productReducer from "./features/adminSlice/products/productSlice";
import couponReducer from "./features/adminSlice/coupons/couponSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,

    customer: customerReducer,
    categoryAdmin: categoryReducer,
    brandAdmin: brandReducer,
    colorAdmin: colorReducer,
    productAdmin: productReducer,
    couponAdmin: couponReducer,
  },
});

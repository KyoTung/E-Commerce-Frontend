import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice/authSlice";
import userReducer from "./features/guestSlice/user/userSlice";
import customerReducer from "./features/adminSlice/customerSlice/customerSlice";
import categoryReducer from "./features/adminSlice/category/categorySlice";
import brandReducer from "./features/adminSlice/brand/brandSlice";
import colorReducer from "./features/adminSlice/color/colorSlice";
import productReducer from "./features/adminSlice/products/productSlice";
import couponReducer from "./features/adminSlice/coupons/couponSlice";
import blogCategoryReducer from "./features/adminSlice/blogCategory/blogCategorySlice";
import blogReducer from "./features/adminSlice/blog/blogSlice";
import orderReducer from "./features/adminSlice/orders/orderSlice";
import productClientReducer from "./features/guestSlice/product/productSlice";
import cartReducer from "./features/guestSlice/cart/cartSlice";
import orderClientReducer from "./features/guestSlice/order/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    productClient: productClientReducer,
    cart: cartReducer,
    orderClient: orderClientReducer,

    customer: customerReducer,
    categoryAdmin: categoryReducer,
    brandAdmin: brandReducer,
    colorAdmin: colorReducer,
    productAdmin: productReducer,
    couponAdmin: couponReducer,
    blogCategoryAdmin: blogCategoryReducer,
    blogAdmin: blogReducer,
    orderAdmin: orderReducer,
  },
});

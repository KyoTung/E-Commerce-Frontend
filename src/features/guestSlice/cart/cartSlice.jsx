import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "./cartService";
import { toast } from "react-toastify";

const initialState = {
  cart: null, // Chứa thông tin giỏ hàng (products, cartTotal,...)
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getCart = createAsyncThunk(
  "cart/get-cart",
  async (_, thunkAPI) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add-to-cart",
  async (data, thunkAPI) => {
    try {
      const response = await cartService.addToCart(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/delete-item",
  async (itemId, thunkAPI) => {
    try {
      return await cartService.deleteCartItem(itemId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update-item",
  async (data, thunkAPI) => {
    try {
      return await cartService.updateCartItem(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCart = createAsyncThunk(
  "cart/delete-cart",
  async (_, thunkAPI) => {
    try {
      return await cartService.deleteCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;

        state.cart = null;
      })

      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.cart = action.payload;
        toast.success("Thêm sản phẩm vào giỏ hàng thành công")
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message;
       toast.error("Thêm sản phẩm vào giỏ hàng thất bại")
      })

      // --- DELETE ITEM ---
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
       toast.success("Xóa sản phẩm khỏi giỏ hàng thành công")
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại")
      })
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
         toast.success("Cập nhật giỏ hàng thành công")
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
         toast.error("Cập nhật giỏ hàng thất bại")
      })

      .addCase(deleteCart.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = null;  
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error("Xóa giỏ hàng thất bại")
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;

import productService from "./productService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  product:{},
  products: [],
  loading: false,
  error: null,
};


 export const getAllProducts = createAsyncThunk(
  "admin/product/get-all-products",
  async (params, thunkAPI) => {
    try {
      const response = await productService.getAllProducts(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getProduct = createAsyncThunk("admin/product/get-product", async (productId, thunkAPI) => {
  try {
    const response = await productService.getProduct(productId);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const addwishList = createAsyncThunk("guest/product/add-wishlist", async (productId, thunkAPI) => {
  try {
    const response = await productService.addwishList(productId); 
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const commentProduct = createAsyncThunk("guest/product/comment-product", async ({data}, thunkAPI) => {
  try {
    const response = await productService.commentProduct(data); 
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});


export const productClientSlice = createSlice({
  name: "product-client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
    
    .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch product";
      })

      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;  
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      .addCase(addwishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addwishList.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addwishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to wishlist";
      })

      .addCase(commentProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(commentProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(commentProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to comment on product";
      })
  }
})

export default productClientSlice.reducer;


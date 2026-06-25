import productService from "./productService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  product: {},
  products: [],
  loading: false,
  error: null,
  totalProducts: 0,
  totalPages: 1,
  currentPage: 1,
};

export const createProduct = createAsyncThunk(
  "admin/product/create-product",
  async (productData, thunkAPI) => {
    try {
      const response = await productService.createProduct(productData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const updateProduct = createAsyncThunk(
  "admin/product/update",
  async ({ productId, productData }, thunkAPI) => {
    try {
      const response = await productService.updateProduct(
        productId,
        productData,
      );
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const getAllProducts = createAsyncThunk(
  "admin/product/get-all-products",
  async (params = {}, thunkAPI) => {
    try {
      // Chuyển thẳng object params sang service xử lý đóng gói Axios
      const response = await productService.getAllProductsAdmin(params);
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getProduct = createAsyncThunk(
  "admin/product/get-product",
  async (productId, thunkAPI) => {
    try {
      const response = await productService.getProduct(productId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "admin/product/delete-product",
  async (productId, thunkAPI) => {
    try {
      const response = await productService.deleteProduct(productId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const productSlice = createSlice({
  name: "product-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create product";
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update product";
      })

     // Tìm đến addCase của deleteProduct trong file productSlice.jsx và sửa thành:
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật lại thuộc tính isActive của sản phẩm trong mảng local store
        const index = state.products.findIndex(
          (product) => product._id === action.payload.product?._id
        );
        if (index !== -1) {
          state.products[index].isActive = action.payload.product?.isActive;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Thao tác thay đổi trạng thái sản phẩm thất bại";
      })

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
      state.products = action.payload.products;
      state.totalProducts = action.payload.total;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    })
    .addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch products";
    });
  },
});

export default productSlice.reducer;

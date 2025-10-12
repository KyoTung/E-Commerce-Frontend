import categoryService from "./categoryService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};


const getAllCategory = createAsyncThunk("admin/category/get-all-category", async (token, thunkAPI) => {
  try {
    const response = await categoryService.getAllCategory(token);       
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }


export const categorySlice = createSlice({
  name: "category-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => { 


  }

});

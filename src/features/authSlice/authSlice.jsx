import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const userState = {
  _id: selectAllAppliedNumericalValuesIncludingErrorValues,
  fullName: null,
  email: null,
  address: null,
  phone: null,
  token: null,
};

const initiaState = {
  user: userState,
  isError: false,
  isSuccess: false,
  isLoadiing: false,
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initiaState,
  reducers: {},
  extraReducers: (builder) => {},
});

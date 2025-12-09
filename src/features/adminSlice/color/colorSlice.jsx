import colorService from "./colorService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  colors: [],
  loading: false,
  error: null,
};

export const createColor = createAsyncThunk("admin/color/create-color",
  async (colorData, thunkAPI) => {
    try {
      const response = await colorService.createColor(colorData, );
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  });

export const updateColor = createAsyncThunk("admin/color/update", async ({ colorId, colorData}, thunkAPI) => {
  try {
    const response = await colorService.updateColor(colorId, colorData, );
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllColor = createAsyncThunk(
  "admin/color/get-all-color",
  async (_, thunkAPI) => {
    try {
      const response = await colorService.getAllColor();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getColor = createAsyncThunk("admin/color/get-color", async (colorId, thunkAPI) => {
  try {
    const response = await colorService.getColor(colorId, );
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const deleteColor = createAsyncThunk("admin/color/delete-color", async (colorId, thunkAPI) => {
  try {
    const response = await colorService.deleteColor(colorId, );
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const colorSlice = createSlice({
  name: "brand-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors.push(action.payload);
      })
      .addCase(createColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create color";
      })

      .addCase(updateColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.colors.findIndex(color => color.id === action.payload.id);
        if (index !== -1) {
          state.colors[index] = action.payload;
        }
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update color";
      })

      .addCase(deleteColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = state.colors.filter(color => color.id !== action.payload.id);
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete color";
      })


    .addCase(getColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload;
      })
      .addCase(getColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch color";
      })

      .addCase(getAllColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload;
      })
      .addCase(getAllColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch colors";
      });
  },
});

export default colorSlice.reducer;

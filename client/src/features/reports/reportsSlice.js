// client/src/features/reports/reportsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchUserReports = createAsyncThunk(
  "reports/fetchUserReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/my-reports");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

export const createReport = createAsyncThunk(
  "reports/createReport",
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await api.post("/reports", reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create report"
      );
    }
  }
);

export const cancelReport = createAsyncThunk(
  "reports/cancelReport",
  async (reportId, { rejectWithValue }) => {
    try {
      await api.delete(`/reports/${reportId}`);
      return reportId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel report"
      );
    }
  }
);

// Initial state
const initialState = {
  reports: [],
  loading: false,
  error: null,
  success: false,
};

// Slice
const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    clearReportsSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user reports
      .addCase(fetchUserReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data;
      })
      .addCase(fetchUserReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reports.unshift(action.payload.data);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel report
      .addCase(cancelReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );
      })
      .addCase(cancelReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportsError, clearReportsSuccess } = reportsSlice.actions;

export default reportsSlice.reducer;

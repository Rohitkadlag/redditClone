// src/features/discussions/discussionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDiscussions = createAsyncThunk(
  "discussions/fetchDiscussions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/discussions", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discussions"
      );
    }
  }
);

export const createDiscussion = createAsyncThunk(
  "discussions/createDiscussion",
  async (discussionData, { rejectWithValue }) => {
    try {
      const response = await api.post("/discussions", discussionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create discussion"
      );
    }
  }
);

export const fetchDiscussion = createAsyncThunk(
  "discussions/fetchDiscussion",
  async (discussionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/discussions/${discussionId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discussion"
      );
    }
  }
);

export const voteDiscussion = createAsyncThunk(
  "discussions/voteDiscussion",
  async ({ discussionId, voteType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/discussions/${discussionId}/vote`, {
        voteType,
      });
      return { discussionId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to vote on discussion"
      );
    }
  }
);

const initialState = {
  discussions: [],
  loading: false,
  error: null,
  currentDiscussion: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch discussions
      .addCase(fetchDiscussions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscussions.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page,
            pages: action.payload.pagination.pages,
            total: action.payload.total,
          };
        }
      })
      .addCase(fetchDiscussions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create discussion
      .addCase(createDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions.unshift(action.payload);
      })
      .addCase(createDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDiscussion = action.payload;
      })
      .addCase(fetchDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(voteDiscussion.fulfilled, (state, action) => {
        const { discussionId, score, userVote } = action.payload;

        const discussionIndex = state.discussions.findIndex(
          (d) => d._id === discussionId
        );
        if (discussionIndex !== -1) {
          state.discussions[discussionIndex].score = score;
          state.discussions[discussionIndex].userVote = userVote;
        }

        // Update current discussion if it matches
        if (
          state.currentDiscussion &&
          state.currentDiscussion._id === discussionId
        ) {
          state.currentDiscussion.score = score;
          state.currentDiscussion.userVote = userVote;
        }
      });
  },
});

export const { clearError } = discussionsSlice.actions;

export default discussionsSlice.reducer;

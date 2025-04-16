import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${username}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "users/fetchUserPosts",
  async ({ username, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${username}/posts`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user posts"
      );
    }
  }
);

export const fetchUserComments = createAsyncThunk(
  "users/fetchUserComments",
  async ({ username, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${username}/comments`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user comments"
      );
    }
  }
);

export const followUser = createAsyncThunk(
  "users/followUser",
  async ({ username, action }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${username}/follow`, { action });
      return { username, ...response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow/unfollow user"
      );
    }
  }
);

const initialState = {
  profile: null,
  posts: [],
  comments: [],
  loading: false,
  error: null,
  pagination: {
    posts: { page: 1, pages: 1, total: 0 },
    comments: { page: 1, pages: 1, total: 0 },
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.posts = [];
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        if (action.payload.pagination) {
          state.pagination.posts = {
            page: action.payload.pagination.page,
            pages: action.payload.pagination.pages,
            total: action.payload.total || 0,
          };
        }
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user comments
      .addCase(fetchUserComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data;
        if (action.payload.pagination) {
          state.pagination.comments = {
            page: action.payload.pagination.page,
            pages: action.payload.pagination.pages,
            total: action.payload.total || 0,
          };
        }
      })
      .addCase(fetchUserComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Follow/unfollow user
      .addCase(followUser.fulfilled, (state, action) => {
        if (
          state.profile &&
          state.profile.username === action.payload.username
        ) {
          state.profile.isFollowing = action.payload.isFollowing;
        }
      });
  },
});

export const { clearError, clearUserData } = usersSlice.actions;

export default usersSlice.reducer;

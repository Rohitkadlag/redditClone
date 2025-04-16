import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/posts", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post("/posts", postData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const votePost = createAsyncThunk(
  "posts/votePost",
  async ({ postId, voteType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { voteType });
      return { postId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to vote");
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          pages: action.payload.pagination.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single post
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Vote on post
      .addCase(votePost.fulfilled, (state, action) => {
        const { postId, score, userVote } = action.payload;

        // Update in posts list
        const postIndex = state.posts.findIndex((post) => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].score = score;
          state.posts[postIndex].userVote = userVote;
        }

        // Update current post if it matches
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.score = score;
          state.currentPost.userVote = userVote;
        }
      });
  },
});

export const { clearError, clearCurrentPost } = postsSlice.actions;

export default postsSlice.reducer;

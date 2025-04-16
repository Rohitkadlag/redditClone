// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../services/api";

// export const fetchSubreddits = createAsyncThunk(
//   "subreddits/fetchSubreddits",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/subreddits", { params });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch subreddits"
//       );
//     }
//   }
// );

// export const fetchSubreddit = createAsyncThunk(
//   "subreddits/fetchSubreddit",
//   async (subredditId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/subreddits/${subredditId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch subreddit"
//       );
//     }
//   }
// );

// export const createSubreddit = createAsyncThunk(
//   "subreddits/createSubreddit",
//   async (subredditData, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/subreddits", subredditData);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to create subreddit"
//       );
//     }
//   }
// );

// export const joinSubreddit = createAsyncThunk(
//   "subreddits/joinSubreddit",
//   async ({ subredditId, action }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/subreddits/${subredditId}/join`, {
//         action,
//       });
//       return { subredditId, ...response.data.data };
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to join/leave subreddit"
//       );
//     }
//   }
// );

// const initialState = {
//   subreddits: [],
//   currentSubreddit: null,
//   loading: false,
//   error: null,
//   pagination: {
//     page: 1,
//     pages: 1,
//     total: 0,
//   },
// };

// const subredditsSlice = createSlice({
//   name: "subreddits",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearCurrentSubreddit: (state) => {
//       state.currentSubreddit = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch subreddits
//       .addCase(fetchSubreddits.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSubreddits.fulfilled, (state, action) => {
//         state.loading = false;
//         state.subreddits = action.payload.data;
//         if (action.payload.pagination) {
//           state.pagination = {
//             page: action.payload.pagination.page,
//             pages: action.payload.pagination.pages,
//             total: action.payload.total,
//           };
//         }
//       })
//       .addCase(fetchSubreddits.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch single subreddit
//       .addCase(fetchSubreddit.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSubreddit.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentSubreddit = action.payload;
//       })
//       .addCase(fetchSubreddit.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Create subreddit
//       .addCase(createSubreddit.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createSubreddit.fulfilled, (state, action) => {
//         state.loading = false;
//         state.subreddits.unshift(action.payload);
//         state.currentSubreddit = action.payload;
//       })
//       .addCase(createSubreddit.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Join/leave subreddit
//       .addCase(joinSubreddit.fulfilled, (state, action) => {
//         const { subredditId, isJoined, subscribers } = action.payload;

//         // Update in subreddits list
//         const subredditIndex = state.subreddits.findIndex(
//           (s) => s._id === subredditId
//         );
//         if (subredditIndex !== -1) {
//           state.subreddits[subredditIndex].isJoined = isJoined;
//           state.subreddits[subredditIndex].subscribers = subscribers;
//         }

//         // Update current subreddit if it matches
//         if (
//           state.currentSubreddit &&
//           state.currentSubreddit._id === subredditId
//         ) {
//           state.currentSubreddit.isJoined = isJoined;
//           state.currentSubreddit.subscribers = subscribers;
//         }
//       });
//   },
// });

// export const { clearError, clearCurrentSubreddit } = subredditsSlice.actions;

// export default subredditsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchSubreddits = createAsyncThunk(
  "subreddits/fetchSubreddits",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/subreddits", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subreddits"
      );
    }
  }
);

export const fetchSubreddit = createAsyncThunk(
  "subreddits/fetchSubreddit",
  async (subredditId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subreddits/${subredditId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subreddit"
      );
    }
  }
);

export const createSubreddit = createAsyncThunk(
  "subreddits/createSubreddit",
  async (subredditData, { rejectWithValue }) => {
    try {
      const response = await api.post("/subreddits", subredditData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subreddit"
      );
    }
  }
);

export const joinSubreddit = createAsyncThunk(
  "subreddits/joinSubreddit",
  async ({ subredditId, action }, { rejectWithValue }) => {
    try {
      console.log(
        `[Redux] Sending ${action} request for subreddit ${subredditId}`
      );

      // Make the API call to join/leave
      const response = await api.post(`/subreddits/${subredditId}/join`, {
        action,
      });

      // Log the response for debugging
      console.log(`[Redux] ${action} response:`, response.data);

      // Return the response data with the subredditId
      return {
        subredditId,
        ...response.data.data,
      };
    } catch (error) {
      console.error("[Redux] Join/leave error:", error);
      return rejectWithValue(
        error.response?.data?.message || `Failed to ${action} subreddit`
      );
    }
  }
);

const initialState = {
  subreddits: [],
  currentSubreddit: null,
  loading: false,
  joinLeaveLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 25,
    total: 0,
  },
};

const subredditsSlice = createSlice({
  name: "subreddits",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSubreddit: (state) => {
      state.currentSubreddit = null;
    },
    // Manual update join status reducer for direct state manipulation if needed
    updateJoinStatus: (state, action) => {
      const { subredditId, isJoined } = action.payload;

      // Update in subreddits list
      const subredditIndex = state.subreddits.findIndex(
        (s) => s._id === subredditId
      );
      if (subredditIndex !== -1) {
        state.subreddits[subredditIndex].isJoined = isJoined;
      }

      // Update current subreddit if it matches
      if (
        state.currentSubreddit &&
        state.currentSubreddit._id === subredditId
      ) {
        state.currentSubreddit.isJoined = isJoined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subreddits
      .addCase(fetchSubreddits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubreddits.fulfilled, (state, action) => {
        state.loading = false;
        state.subreddits = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page || 1,
            limit: action.payload.pagination.limit || 25,
            total: action.payload.count || 0,
          };
        }
      })
      .addCase(fetchSubreddits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single subreddit
      .addCase(fetchSubreddit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubreddit.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubreddit = action.payload;

        // Also update this subreddit in the subreddits list if it exists
        const index = state.subreddits.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.subreddits[index] = {
            ...state.subreddits[index],
            ...action.payload,
          };
        }
      })
      .addCase(fetchSubreddit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create subreddit
      .addCase(createSubreddit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubreddit.fulfilled, (state, action) => {
        state.loading = false;
        state.subreddits.unshift(action.payload);
        state.currentSubreddit = action.payload;
      })
      .addCase(createSubreddit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Join/leave subreddit
      .addCase(joinSubreddit.pending, (state) => {
        state.joinLeaveLoading = true;
        state.error = null;
      })
      .addCase(joinSubreddit.fulfilled, (state, action) => {
        state.joinLeaveLoading = false;

        const { subredditId, isJoined, subscribers } = action.payload;
        console.log(
          `[Redux] Join/leave fulfilled - subredditId: ${subredditId}, isJoined: ${isJoined}`
        );

        // Update in subreddits list
        const subredditIndex = state.subreddits.findIndex(
          (s) => s._id === subredditId
        );
        if (subredditIndex !== -1) {
          state.subreddits[subredditIndex].isJoined = isJoined;
          state.subreddits[subredditIndex].subscribers = subscribers;
        }

        // Update current subreddit if it matches
        if (
          state.currentSubreddit &&
          state.currentSubreddit._id === subredditId
        ) {
          state.currentSubreddit.isJoined = isJoined;
          state.currentSubreddit.subscribers = subscribers;
        }
      })
      .addCase(joinSubreddit.rejected, (state, action) => {
        state.joinLeaveLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentSubreddit, updateJoinStatus } =
  subredditsSlice.actions;

export default subredditsSlice.reducer;

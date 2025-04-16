import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/${postId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

// Add to src/features/comments/commentsSlice.js

export const fetchDiscussionComments = createAsyncThunk(
  "comments/fetchDiscussionComments",
  async ({ discussionId, sortBy = "top" }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/discussions/${discussionId}`, {
        params: { sortBy },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const createDiscussionComment = createAsyncThunk(
  "comments/createDiscussionComment",
  async ({ discussionId, content, parentId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/discussions/${discussionId}`, {
        content,
        parentId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, content, parentId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${postId}`, {
        content,
        parentId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

export const voteComment = createAsyncThunk(
  "comments/voteComment",
  async ({ commentId, voteType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${commentId}/vote`, {
        voteType,
      });
      return { commentId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to vote");
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    addNewComment: (state, action) => {
      // Handle real-time comment addition from socket
      const comment = action.payload;
      if (!comment.parent) {
        // Add as top-level comment
        state.comments.unshift(comment);
      } else {
        // Add as reply - would need a more complex implementation
        // to add nested replies correctly
      }
    },
    updateComment: (state, action) => {
      // Handle real-time comment update from socket
      const updatedComment = action.payload;

      // Find and update the comment
      const updateNestedComment = (comments) => {
        return comments.map((comment) => {
          if (comment._id === updatedComment._id) {
            return { ...comment, ...updatedComment };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateNestedComment(comment.replies),
            };
          }
          return comment;
        });
      };

      state.comments = updateNestedComment(state.comments);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;

        // Add comment to the appropriate place
        const newComment = action.payload;

        if (!newComment.parent) {
          // Add as top-level comment
          state.comments.unshift(newComment);
        } else {
          // Add as reply - recursive function to find parent
          const addReply = (comments) => {
            return comments.map((comment) => {
              if (comment._id === newComment.parent) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReply(comment.replies),
                };
              }
              return comment;
            });
          };

          state.comments = addReply(state.comments);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add these cases
      .addCase(createDiscussionComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscussionComment.fulfilled, (state, action) => {
        state.loading = false;

        // Add comment to the appropriate place
        const newComment = action.payload;

        if (!newComment.parent) {
          // Add as top-level comment
          state.comments.unshift(newComment);
        } else {
          // Add as reply - recursive function to find parent
          const addReply = (comments) => {
            return comments.map((comment) => {
              if (comment._id === newComment.parent) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReply(comment.replies),
                };
              }
              return comment;
            });
          };

          state.comments = addReply(state.comments);
        }
      })
      .addCase(createDiscussionComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDiscussionComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscussionComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchDiscussionComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Vote on comment
      .addCase(voteComment.fulfilled, (state, action) => {
        const { commentId, score, userVote } = action.payload;

        // Update the comment - recursive function to find it
        const updateVote = (comments) => {
          return comments.map((comment) => {
            if (comment._id === commentId) {
              return { ...comment, score, userVote };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateVote(comment.replies),
              };
            }
            return comment;
          });
        };

        state.comments = updateVote(state.comments);
      });
  },
});

export const { clearComments, clearError, addNewComment, updateComment } =
  commentsSlice.actions;

export default commentsSlice.reducer;

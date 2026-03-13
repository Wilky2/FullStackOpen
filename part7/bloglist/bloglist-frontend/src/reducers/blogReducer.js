import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setSuccessNotification } from "./successNotificationReducer";
import { setErrorNotification } from "./errorNotificationReducer";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    deletedBlog(state, action) {
      const blogToDelete = action.payload;
      return state.filter((blog) => blog.id !== blogToDelete.id);
    },
    likedBlog(state, action) {
      const likedBlog = action.payload;
      return state.map((blog) => (blog.id === likedBlog.id ? likedBlog : blog));
    },
    createdBlog(state, action) {
      const blog = action.payload;
      state.push(blog);
    },
    commentedBlog(state, action) {
      const comment = action.payload.comment;
      const blogId = action.payload.blogId;
      const commentedBlog = state.find((blog) => blog.id === blogId);
      commentedBlog.comments
        ? commentedBlog.comments.push(comment)
        : (commentedBlog.comments = [comment]);
      return state;
    },
    setBlogs(_state, action) {
      return action.payload;
    },
  },
});

const { setBlogs, createdBlog, deletedBlog, likedBlog, commentedBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      dispatch(
        setErrorNotification(
          `The blog posts could not be loaded due to a server error`,
          5,
        ),
      );
    }
  };
};

export const appendBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.create(newBlog);
      dispatch(createdBlog(blog));
      dispatch(
        setSuccessNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          5,
        ),
      );
    } catch (error) {
      if (error.response.status === 500) {
        dispatch(
          setErrorNotification(
            `Blog ${newBlog.title} by ${newBlog.author} cannot be added due to a server error`,
            5,
          ),
        );
        return;
      }
      dispatch(setErrorNotification(`${error.response.data.error}`, 5));
    }
  };
};

export const commentBlog = (newComment, blog) => {
  return async (dispatch) => {
    try {
      const comment = await blogService.comment(newComment, blog.id);
      dispatch(commentedBlog({ comment, blogId: blog.id }));
    } catch (error) {
      if (error.response.status === 500) {
        dispatch(
          setErrorNotification(
            `Blog ${blog.title} by ${blog.author} cannot be commented due to a server error`,
            5,
          ),
        );
        return;
      }
      if (error.response.status === 404) {
        dispatch(
          setErrorNotification(
            `Blog ${blog.title} by ${blog.author} cannot be found`,
            5,
          ),
        );
        return;
      }
      dispatch(setErrorNotification(`${error.response.data.error}`, 5));
    }
  };
};

export const removeBlog = (blogToDelete) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blogToDelete);
      dispatch(deletedBlog(blogToDelete));
      dispatch(setSuccessNotification(`Delete ${blogToDelete.title}`, 5));
    } catch (error) {
      dispatch(
        setErrorNotification(
          `Blog ${blogToDelete.title} by ${blogToDelete.author} cannot be delete due to a server error`,
          5,
        ),
      );
    }
  };
};

export const likeBlog = (blogToLike) => {
  return async (dispatch) => {
    try {
      const blogToLikeCopy = { ...blogToLike };
      blogToLikeCopy.user = blogToLikeCopy.user.id;
      blogToLikeCopy.likes = blogToLikeCopy.likes + 1;
      const updatedBlog = await blogService.update(blogToLikeCopy);
      const blog = { ...blogToLike };
      blog.likes = updatedBlog.likes;
      dispatch(likedBlog(blog));
    } catch (error) {
      dispatch(
        setErrorNotification(
          `Blog ${blogToLike.title} by ${blogToLike.author} cannot be liked due to a server error`,
          5,
        ),
      );
    }
  };
};

export default blogSlice.reducer;

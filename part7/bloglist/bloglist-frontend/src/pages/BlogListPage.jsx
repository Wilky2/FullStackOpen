import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeBlogs } from "../reducers/blogReducer";
import {
  ErrorNotification,
  SuccessNotification,
} from "../components/notifications";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import BlogList from "../components/BlogList";

const BlogListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  return (
    <>
      <ErrorNotification />
      <SuccessNotification />
      <Togglable buttonLabel="create new">
        <BlogForm />
      </Togglable>
      <BlogList />
    </>
  );
};

export default BlogListPage;

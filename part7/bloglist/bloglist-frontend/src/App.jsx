import Login from "./components/Login";
import { Routes, Route, useMatch } from "react-router-dom";
import BlogListPage from "./pages/BlogListPage";
import UserListPage from "./pages/UserListPage";
import { useDispatch, useSelector } from "react-redux";
import { loadAuthenticateUser } from "./reducers/authenticationReducer";
import { useEffect } from "react";
import { loadUsers } from "./reducers/userReducer";
import UserPage from "./pages/UserPage";
import BlogPage from "./pages/BlogPage";
import NavigationMenu from "./components/NavigationMenu";
import Container from "react-bootstrap/Container";

const App = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loginUser);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);
  const userMatch = useMatch("/users/:id");
  const blogMatch = useMatch("/blogs/:id");

  const userById = (id) => users.find((user) => user.id === id);
  const user = userMatch ? userById(userMatch.params.id) : null;

  const blogById = (id) => blogs.find((blog) => blog.id === id);
  const blog = blogMatch ? blogById(blogMatch.params.id) : null;

  useEffect(() => {
    dispatch(loadAuthenticateUser());
  }, []);

  useEffect(() => {
    dispatch(loadUsers());
  }, []);

  return (
    <div>
      {loggedUser && <NavigationMenu />}
      <Container fluid>
        {!loggedUser && <Login />}
        {loggedUser && (
          <>
            <h1 className="fw-bold fs-2 text-center mb-5 mt-3">blog app</h1>
            <Routes>
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/:id" element={<UserPage user={user} />} />
              <Route path="/blogs/:id" element={<BlogPage blog={blog} />} />
              <Route path="/" element={<BlogListPage />} />
            </Routes>
          </>
        )}
      </Container>
    </div>
  );
};

export default App;

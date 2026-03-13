import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { logout } from "../reducers/authenticationReducer";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";

const NavigationMenu = () => {
  const user = useSelector((state) => state.loginUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const margin = {
    margin: 10,
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span" style={margin}>
            <Link className="text-light" to="/">
              blogs
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span" style={margin}>
            <Link className="text-light" to="/users">
              users
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span" style={margin}>
            {user && <em className="text-light">{user.name} logged in</em>}
          </Nav.Link>

          {user && (
            <Nav.Link
              href="#"
              style={margin}
              className="text-light text-decoration-underline"
              onClick={handleLogout}
            >
              logout
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationMenu;

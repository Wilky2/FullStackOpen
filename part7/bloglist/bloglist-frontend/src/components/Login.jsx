import handleStrInputChange from "../utils/handleStrInputChange";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ErrorNotification } from "./notifications";
import { login } from "../reducers/authenticationReducer";
import { Form, Button, Row, Col } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(login({ username, password }));
    setUsername("");
    setPassword("");
  };

  return (
    <Row className="justify-content-center mb-2">
      <Col lg="6">
        <Form onSubmit={handleLogin}>
          <h2 className="fs-3 fw-bold mt-5 mb-3 text-center">
            Log in to application
          </h2>
          <ErrorNotification />
          <Form.Group>
            <Form.Label>username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={handleStrInputChange(setUsername)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={handleStrInputChange(setPassword)}
            />
          </Form.Group>
          <Button className="mt-1" variant="outline-primary" type="submit">
            login
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;

import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Row className="justify-content-center">
      <Col lg="6">
        <div style={hideWhenVisible}>
          <Button
            variant="outline-primary"
            className="mb-1"
            onClick={toggleVisibility}
          >
            {props.buttonLabel}
          </Button>
        </div>
        <div style={showWhenVisible}>
          <Button
            className="mb-1"
            variant="outline-primary"
            onClick={toggleVisibility}
          >
            cancel
          </Button>
          {props.children}
        </div>
      </Col>
    </Row>
  );
};

export default Togglable;

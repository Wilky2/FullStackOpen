import handleStrInputChange from "../utils/handleStrInputChange";
import { useState } from "react";
import { appendBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(appendBlog({ title, author, url }));
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Row className="justify-content-center mb-2">
      <Col lg="6">
        <Form onSubmit={handleSubmit}>
          <h2 className="fs-3 fw-bold mt-2 mb-3 text-center">create new</h2>
          <Form.Group>
            <Form.Label>title:</Form.Label>
            <Form.Control
              value={title}
              onChange={handleStrInputChange(setTitle)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>author:</Form.Label>
            <Form.Control
              value={author}
              onChange={handleStrInputChange(setAuthor)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>url:</Form.Label>
            <Form.Control value={url} onChange={handleStrInputChange(setUrl)} />
          </Form.Group>
          <Button className="mt-1" variant="outline-primary" type="submit">
            create
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default BlogForm;

import { useDispatch } from "react-redux";
import { likeBlog } from "../reducers/blogReducer";
import handleStrInputChange from "../utils/handleStrInputChange";
import { useState } from "react";
import { commentBlog } from "../reducers/blogReducer";
import {
  Col,
  Row,
  Button,
  Form,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

const BlogPage = ({ blog }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handleLike = async (likedBlog) => {
    dispatch(likeBlog(likedBlog));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(commentBlog(comment, blog));
    setComment("");
  };

  return (
    blog && (
      <>
        <h2 className="fs-3 fw-bold mt-5 mb-3 text-center">
          {blog.title} {blog.author}
        </h2>
        <Row className="justify-content-center">
          <Col lg="6">
            <div>
              <a href={blog.url}>{blog.url}</a>
            </div>
            <div>
              likes {blog.likes}
              <Button
                variant="outline-primary"
                onClick={() => handleLike(blog)}
                className="ms-1"
              >
                like
              </Button>
            </div>
            <div>added by {blog.user.username}</div>
          </Col>
        </Row>
        <h3 className="fs-4 fw-bold mt-2 mb-3 text-center">comments</h3>
        <Row className="justify-content-center">
          <Col lg="6">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs="7" sm="7">
                  <Form.Control
                    value={comment}
                    onChange={handleStrInputChange(setComment)}
                  />
                </Col>
                <Col xs="4" sm="4">
                  <Button variant="outline-primary" type="submit">
                    add comments
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col lg="6">
            <ListGroup>
              {blog.comments &&
                blog.comments.map((comment) => {
                  return (
                    <ListGroupItem key={comment.id}>
                      {comment.comment}
                    </ListGroupItem>
                  );
                })}
            </ListGroup>
          </Col>
        </Row>
      </>
    )
  );
};

export default BlogPage;

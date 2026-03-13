import { useSelector } from "react-redux";
import Blog from "./Blog";
import { Row, Col, ListGroup } from "react-bootstrap";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  const sortedBlogs = [...blogs].sort(
    (blog1, blog2) => blog2.likes - blog1.likes,
  );

  return (
    <Row className="justify-content-center">
      <Col lg="6">
        <ListGroup>
          {sortedBlogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </ListGroup>
      </Col>
    </Row>
  );
};

export default BlogList;

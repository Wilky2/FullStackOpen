import Row from "react-bootstrap/esm/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/esm/Col";

const UserPage = ({ user }) => {
  return (
    user && (
      <Row className="justify-content-center">
        <h2 className="fs-3 fw-bold mb-3 text-center">{user.name}</h2>
        <h3 className="fs-4 fw-bold mb-3 text-center">added blogs</h3>
        <Col lg="6">
          <ListGroup>
            {user.blogs.map((blog) => {
              return (
                <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    )
  );
};

export default UserPage;

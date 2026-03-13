import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UserList = () => {
  const users = useSelector((state) => state.users);

  return (
    <Row className="justify-content-center">
      <Col lg="6">
        <Table bordered size="sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>
                    <Link
                      className="text-dark text-decoration-underline fw-bold"
                      to={`/users/${user.id}`}
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td>{user.blogs.length}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default UserList;

import { Link } from "react-router-dom";
import { ListGroupItem } from "react-bootstrap";
const Blog = ({ blog }) => {
  return (
    <ListGroupItem>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </ListGroupItem>
  );
};
export default Blog;

import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = ({ message, variant }) => {
  if (message === null) {
    return null;
  }

  return <Alert variant={variant}>{message}</Alert>;
};

const SuccessNotification = () => {
  const message = useSelector((state) => state.successNotification);
  return <Notification message={message} variant="success" />;
};

const ErrorNotification = () => {
  const message = useSelector((state) => state.errorNotification);
  return <Notification message={message} variant="danger" />;
};

export { ErrorNotification, SuccessNotification };

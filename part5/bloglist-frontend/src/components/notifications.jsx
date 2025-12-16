const error = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const success = {
  color: 'green',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const SuccessNotification = ({ message }) => {
  return <Notification message={message} style={success}/>
}

const ErrorNotification = ({ message }) => {
  return <Notification message={message} style={error}/>
}

export { ErrorNotification, SuccessNotification }
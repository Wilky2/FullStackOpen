const handleStrInputChange = (setFunction) => {
  return (event) => {
    setFunction(event.target.value)
  }
}

export default handleStrInputChange


import React from 'react';
import { useEffect, useState } from 'react'
import personService from './services/persons'
import { ErrorNotification, SuccessNotification } from './components/notifications';

const Filter = ({search, handleSearchChange})=>{
  return (
    <div>
          filter shown with<input value={search} onChange={handleSearchChange}/>
    </div>
  )
}

const PersonForm = ({handleSubmit, newName, handleNewName, newNumber, handleNewNumber})=>{
  return (
    <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNewName}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({persons, deletePerson})=>{
  return (
    <div>
      {
        persons.map(person=>{
          console.log("Person show",person)
          return (
            <React.Fragment key={person.id}>
              <p>{person.name} {person.number} <button onClick={()=>deletePerson(person)}>delete</button></p>
            </React.Fragment>
          )
        })
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('') 
  const [successMessage, setSucessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=>{
    console.log("Starting effect to fetch persons")
    personService
      .getPersons()
      .then(data=>{
        console.log("Persons fetch",data)
        setPersons(data)
      })
  },[])

  const handleNotFoundError = (error, personNotFound)=>{
    if(error.status===404){
      updateErrorMessage(`Information of ${personNotFound.name} has already been remove from server`)
      setPersons(persons.filter(person=>person.id!==personNotFound.id))
    }
  }

  const handleStrInputChange = (setFunction)=>{
    return (event)=>{
      console.log(event.target.value)
      setFunction(event.target.value)
    }
  }

  const updateMessage = (message, setFunction) => {
    setFunction(message)
    setTimeout(()=>setFunction(null), 5000)
  }

  const updateSucessMessage = (message)=>{
    updateMessage(message, setSucessMessage)
  }

  const updateErrorMessage = (message)=>{
    updateMessage(message, setErrorMessage)
  }

  const addPerson = newPerson => personService
      .savePerson(newPerson)
      .then(data=>{
        console.log("Person save", data)
        setPersons(persons.concat(data))
        setNewName("")
        setNewNumber("")
        updateSucessMessage(`Added ${data.name}`)
      })
      .catch(error=>updateErrorMessage(error.response.data.error))

  const deletePerson = (personToDelete) => {
    if(window.confirm(`Delete ${personToDelete.name}?`)){
      personService
        .deletePerson(personToDelete.id)
        .then(data=>{
          console.log("Data returned from the server for deleting person", data)
          setPersons(persons.filter(person=>person.id!==personToDelete.id))
          updateSucessMessage(`Deleted ${personToDelete.name}`)
        }).catch(error=>handleNotFoundError(error, personToDelete))
    }
  }

  const updatePerson = personToUpdate => personService
      .updatePerson(personToUpdate)
      .then(data=>{
        console.log("Person update", data)
        setPersons(persons.map(person=>person.id !== data.id? person : data))
        updateSucessMessage(`Changed the number of ${data.name}`)
      }).catch(error=> error.status ===404 ?
        handleNotFoundError(error, personToUpdate) 
        : updateErrorMessage(error.response.data.error))

  const handleSubmit = (event)=>{
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}
    const isNewPersonAlreadySave = persons.some(person=>person.name.toLowerCase() === newPerson.name.toLowerCase())
    if(isNewPersonAlreadySave){
      const person = persons.find(person=>person.name.toLowerCase() === newPerson.name.toLowerCase())
      const personToUpdate = {...person, number:newPerson.number}
      if(window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)){
        console.log("Updating", personToUpdate)
        updatePerson(personToUpdate) 
      }
      return
    }
    console.log("Adding", newPerson)
    addPerson(newPerson)
  }

  console.log("Persons",persons)

  const personsToShow = search ? persons.filter(person=>person.name.toLowerCase().includes(search.toLowerCase())) : persons

  console.log("Persons to show",personsToShow)

  return (
    <div>
      <h2>Phonebook</h2>

      <SuccessNotification message={successMessage}/>

      <ErrorNotification message={errorMessage}/>

      <Filter search={search} handleSearchChange={handleStrInputChange(setSearch)}/>

      <h3>Add a new</h3>

      <PersonForm handleSubmit={handleSubmit} 
        newName={newName} handleNewName={handleStrInputChange(setNewName)} 
        newNumber={newNumber} handleNewNumber={handleStrInputChange(setNewNumber)}/>
      
      <h3>Numbers</h3>
      
      <Persons persons={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
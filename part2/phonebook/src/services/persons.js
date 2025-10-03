import axios from 'axios'

const basedUrl = "http://localhost:3001/persons"

const getPersons = () => axios
    .get(basedUrl)
    .then(response=>{
        console.log("Response from fetching persons", response)
        return response.data
    })

const savePerson = newPerson => axios
    .post(basedUrl,newPerson)
    .then(response=>{
        console.log("response from saving person", response)
        return response.data
    })

const deletePerson = personId => axios
    .delete(`${basedUrl}/${personId}`)
    .then(response=>{
        console.log("Response from deleting person", response)
        return response.data
    })

const updatePerson = personToUpdate => axios
    .put(`${basedUrl}/${personToUpdate.id}`, personToUpdate)
    .then(response=>{
        console.log("Response from updating person", response)
        return response.data
    })

export default {getPersons, savePerson, deletePerson, updatePerson}
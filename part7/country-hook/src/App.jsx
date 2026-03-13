import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  const basedUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  const getCountry = (countryName)=>axios
      .get(`${basedUrl}/name/${countryName}`)
      .then(response=>{
          console.log(`Response from getting info about ${countryName}`,response)
          return response.data
      })

  useEffect(() => {
    if(name){
      getCountry(name)
      .then(data=>{
        const countryData = {
          found: true,
          data: {
            name: data.name.common,
            population: data.population,
            capital: data.capital[0],
            flag: data.flags.svg
          }
        }
        setCountry(countryData)
      })
      .catch(e=>{
        const countryData = {
          found: false
        }
        setCountry(countryData)
      })
    }
    else{
      setCountry(null)
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
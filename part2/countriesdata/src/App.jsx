import { useEffect, useState } from 'react'
import countriesService from './services/countries'
import countriesUtils from './utils/countries'
import Country from './components/Country';
import weather from './services/weather';
import Message from './components/Message';
import SearchResult from './components/SearchResult';

const App = () =>  {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [countriesName, setCountriesName] = useState(null)
  const [message, setMessage] = useState(null)
  const [country, setCountry] = useState(null)
  const [countryWeather, setCountryWeather] = useState(null)

  useEffect(()=>{
    console.log("Starting effect to fetch countries")
      countriesService
      .getCountries()
      .then(countries=>{
        console.log("Data from getting all countries",countries)
        setCountriesName(countriesUtils.mapCountryToCountryName(countries))
      })
  }, [])

  const handleSearch = (event)=>{
    const value = event.target.value
    console.log(value)
    setSearch(event.target.value)
    setCountry(null)
    setCountryWeather(null)
    handleEmptyInputValue(value)
    handleNonEmptyInput(value)
  }

  const handleEmptyInputValue = (value)=>{
    if(!value){
      setMessage(null)
      setSearchResult(null)
    }
  }

  const handleNonEmptyInput = (value)=>{
    if(value){
      filterCountriesName(value)
    }
  }

  const filterCountriesName = (value) =>{
    if(countriesName){
      const searchResult = countriesName.filter(countryName=>countryName.name.common.toLowerCase().includes(value.toLowerCase()) || countryName.name.official.toLowerCase().includes(value.toLowerCase()))
      console.log("Data after filtering the country",searchResult)
      handleSearchResultGreaterThanTen(searchResult)
      handleSearchResultLowerThanTen(searchResult)
    }
  }

  const handleSearchResultGreaterThanTen = (searchResult)=>{
    if(searchResult.length > 10){
      setMessage("Too many matches, specify another filter")
      setSearchResult(null)
      return
    }
  }

  const handleSearchResultLowerThanTen = (searchResult)=>{
    if(searchResult.length <= 10){
      searchResult.length == 1 ? handleOneSearchResult(searchResult) : setSearchResult(searchResult)
      setMessage(null)
    }
  }

  const handleOneSearchResult = (searchResult) =>{
    if(searchResult.length == 1){
      setSearchResult(null)
      const countryName = searchResult[0].name.common
      console.log("Country name", countryName)
      setCountryValue(countryName)
    }
  }

  const handleShowCountry = (countryName)=>{
    setSearch(countryName)
    setSearchResult(null)
    setCountryValue(countryName)
  }

  const setCountryValue  = (countryName)=>countriesService
    .getCountry(countryName)
    .then(country=>{
      console.log(`Data from getting info about ${countryName}`,country)
      setCountry(country)
      setWeatherValue(country.capitalInfo.latlng)
    })  

  const setWeatherValue = (latlng)=>weather
    .getWeather(latlng)
    .then(weather=>{
      console.log("Weather",weather)
      setCountryWeather(weather)
    })

  return (
    <div>
      {countriesName ?
        <div>
          find countries <input value={search} onChange={handleSearch}/>
          <SearchResult searchResult={searchResult} handleShowCountry={handleShowCountry} />
          <Message message={message} />
          <Country country={country} countryWeather={countryWeather} />
        </div>
        : <p>Just a moment... We're getting things ready for you!</p>
      }
    </div>
  )
}

export default App

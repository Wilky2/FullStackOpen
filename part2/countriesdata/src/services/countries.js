import axios from 'axios'

const basedUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getCountries = ()=>axios
    .get(`${basedUrl}/all`)
    .then(response=>{
        console.log("Response from getting all countries",response)
        return response.data
    })

const getCountry = (countryName)=>axios
    .get(`${basedUrl}/name/${countryName}`)
    .then(response=>{
        console.log(`Response from getting info about ${countryName}`,response)
        return response.data
    })


export default { getCountries, getCountry }
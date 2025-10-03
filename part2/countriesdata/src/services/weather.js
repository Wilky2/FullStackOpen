import axios from 'axios'

const api_key = import.meta.env.VITE_API_KEY

const getWeather = (latlng) => {
      return axios
      .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&appid=${api_key}`)
      .then(response=>{
         console.log(`Response for Fetching weather for coordinates: ${latlng}`, response)
         return response.data
      })
   }
export default {getWeather}
import '../index.css'

const Weather = ({weather})=>{
    if(!weather){
        return null
    }

    return (
        <>
            <p>Temperature {weather.current.temp} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} 
                alt={weather.current.weather[0].description}/>
            <p>Wind {weather.current.wind_speed} m/s</p>
        </>
    )
}

const Country = ({country, countryWeather})=>{
    if(!country){
        return null
    }
    return (
        <div>
            <br/>
            <h1 className='title'>{country.name.common}</h1>
            <p>Capital {country.capital[0]} <br/> Area {country.area}</p>
            <h2 className='title'>Languages</h2>
            <ul>
            {Object.entries(country.languages).map(([code, name]) => (
                <li key={code}>
                {name}
                </li>
            ))}
            </ul>
            <img alt={country.flags.alt} src={country.flags.svg} width={350} />
            <h2 className='title'>Weather in {country.capital[0]}</h2>
            <Weather weather={countryWeather} />
        </div> 
    )
}

export default Country
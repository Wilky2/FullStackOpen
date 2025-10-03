const SearchResult = ({searchResult, handleShowCountry})=>{
    if(!searchResult){
        return null
    }

    return (
        searchResult.map(country=>
            <p key={country.name.common}>
                {country.name.common} <button onClick={()=>handleShowCountry(country.name.common)}>Show</button>
            </p>
        )
    )
}

export default SearchResult
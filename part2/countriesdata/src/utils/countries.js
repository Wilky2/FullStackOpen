const mapCountryToCountryName = (countries)=>{
    const countriesName = countries.map(country=>{
      return {
        name: {
          common: country.name.common,
          official: country.name.official
        }
      }
    })
    console.log("Countries name", countriesName)
    return countriesName
  }

export default {mapCountryToCountryName}
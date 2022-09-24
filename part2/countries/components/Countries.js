import React  from 'react';
import Weather from './Weather'
const Countries = ({countries, isTextHidden,  handleTextHidden, weatherDate }) => {  
 if(countries.length === 1){
 isTextHidden = false
 }
  return (        
    <>                
        {countries.map(country =>         
          <div>
          <h3>{country.name.common}  
          <button onClick={() => handleTextHidden(country.car.ccn3)}>{isTextHidden ? 'Show' : 'Hide'}</button></h3>
          {!isTextHidden ?
          <p  key = {country.car.ccn3}>
          <b>Capital : {country.capital}</b><br />
          <b>Area : {country.area}</b>
          <h4>Languages</h4>
          <ul>{ Object.entries(country.languages).map(([key, value]) => <li key = {key}>{value}</li>)}       
          </ul>            	
            <img src={country.flags.svg} alt={country.name.common}  width = '200px'/> 
            {
            countries.length === 1 ? <Weather  weatherDate = {weatherDate} /> : <hr />
             }             
          </p>
          : null}
          </div>
          
        )}    
      </>
     );
}
export default Countries

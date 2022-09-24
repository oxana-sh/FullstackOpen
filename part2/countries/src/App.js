import React, { useState, useEffect } from 'react';
import CountriesView from './services/countries';
import Filter from './components/Filter';
import Countries from './components/Countries'
import Notification from './components/Notification'

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setFilter] = useState('');
  const [message, setMessage] = useState('');
  const [className, setClassName] = useState('')
  const [isTextHidden, setTextHidden] = useState(true);
  const [weatherDate, setWeather] = useState([]);
  const handleTextHidden = id => setTextHidden(!isTextHidden);
  
    useEffect(()  => {
      if (newFilter.length === 0) {
        setMessage(`Enter country name` )
        setClassName('alert')
      }     
        CountriesView
       .getAll(newFilter)
       .then(initialCountries => {
        setCountries(initialCountries)
      })
       }, [newFilter])
 
  useEffect(() => {
    if (countries) {
    const  capital = countries.map(country => country.capital);     
       CountriesView
      .getWeatherForCapital(capital)
      .then(initialWeaather => {
        setWeather(initialWeaather)
      })
    } 
    }, [countries])

  const handleNFindeCountry  = (e) => {
    e.preventDefault() 
    setFilter(e.target.value)
    CountriesView
    .getAll(e.target.value)
    .then(initialCountries => {
      setCountries(initialCountries)
       if (initialCountries.length > 10 ){
        setMessage(`Too many matches, specify another filter` )
        setClassName('alert')
         }
       else{
      setMessage('')
      setClassName('')
      }    
    })
     
  }
  return (
  <div className="App">
     <h2>Filter</h2>
    <Filter newFilter  = {newFilter} handleNFindeCountry = {handleNFindeCountry} /> 
    <Notification message={message} className = {className} />
    <h2>List of Countries</h2>
      <Countries countries = {countries}  weatherDate ={weatherDate} handleTextHidden  = { handleTextHidden} isTextHidden = {isTextHidden} />  
   
  </div>
  )
};

export default App;

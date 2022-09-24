import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/name'
const getAll = newFilter => {
const request = axios.get(`${baseUrl}/${newFilter}`)
//const request = axios.get(`${baseUrl}/Finland`)
 return request.then(response => response.data) 
 
}
const getWeatherForCapital = capital => {   
    const request =  axios.get( `${process.env.REACT_APP_API_URL}/weather/?q=${capital}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
     return request.then(response => response.data) 
}
export default {getAll, getWeatherForCapital}

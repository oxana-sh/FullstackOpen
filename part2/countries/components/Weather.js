import React  from 'react';
const Weather = ({ weatherDate }) => {    

    return (
       <div>
        <h2>Weather in {weatherDate.name}</h2>
        Temperature: <b>{weatherDate.main.temp} °C</b><br />
        Wind: <b>{weatherDate.wind.speed} м/s</b> <br />
        <img src= {`http://openweathermap.org/img/wn/${weatherDate.weather[0].icon}@2x.png`} alt ={weatherDate.weather[0].description}></img>
        </div>
     )
}

export default Weather

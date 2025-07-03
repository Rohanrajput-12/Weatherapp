import React, { useState } from 'react';
import './App.css';

const api = {
  key: "23c5460538d20bb69cf3073115cf5272",
  base: "https://api.openweathermap.org/data/2.5/"
};

const Weather = () => {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchCitySuggestions = async (input) => {
    try {
      const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '4c3eb635ffmsh8f553f2c16f7484p1a7f6cjsn43a2633346e3',
		      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        }
      });

      const data = await response.json();
      const cityNames = data.data.map(city => `${city.name}, ${city.country}`);
      setSuggestions(cityNames);
    } catch (error) {
      console.error("City fetch error", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      fetchCitySuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setQuery(item);
    setSuggestions([]);
  };

  const search = (event) => {
    if (event.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          if (result.cod === 200) {
            setWeather(result);
            setError('');
            setQuery('');
            setSuggestions([]);
          } else {
            setError(result.message);
            setWeather({});
          }
        })
        .catch(err => {
          setError('An error occurred. Please try again.');
        });
    }
  };

  const dateBuilder = (d) => {
    let months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    let days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${year}`;
  };

  return (
    <main>
      <div className='search-box' style={{ position: 'relative' }}>
        <input
          className='search-bar'
          type="text"
          placeholder='Search city or country...'
          value={query}
          onChange={handleInputChange}
          onKeyDown={search}
        />

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSuggestionClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className='error'>{error}</p>}

      {weather.main && (
        <div className='location'>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <div className='date'>
            {dateBuilder(new Date())}
            <div className='weather-box'>
              <div className='temp'>
                {Math.round(weather.main.temp)}°C
              </div>
              <div className='weather'>
                {weather.weather[0].main}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Weather;

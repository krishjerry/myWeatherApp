
import { useState } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState();
  const [weatherData, setWeatherData] = useState({
    main: { temp: 1000 / 3, humidity: 95 },
    wind: { speed: 1.3 },
    name: 'Bhopal',
  });
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const apiKeys = "6a54f1c3d685ee74b63377f8000ae275";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?appid=";
  const geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?appid=";

  const handleSearch = async () => {
    try {
      const response = await fetch(`${apiUrl + apiKeys}&q=${city}`);
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      let data = await response.json();
      console.log(data, 'weather data');
      setWeatherData(data);
      setError(null);
      setSuggestions([]);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  const handleChange = async (e) => {
    const input = e.target.value;
    setCity(input);
    if (input.length > 2) {
      try{
      const response = await fetch(`${geoApiUrl + apiKeys}&q=${input}&limit=5`);
      const data = await response.json();
      setSuggestions(data);
    }catch {
      setSuggestions([]);
    }
  } else {
    setSuggestions([]);
  }
};

const handleSuggestionClick = (suggestion) => {
  setCity(suggestion.name);
  handleSearch(suggestion.name);
};

const handleSubmit = (e) => {
  e.preventDefault();
  handleSearch();
};

const getWeatherIcon = () => {
  if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
    return "png/weather.png";
  }
  const mainCondition = weatherData.weather[0].main;
  if (mainCondition.includes('Clouds')) {
    return "png/cloudy.png";
  } else if (mainCondition.includes('Drizzle')) {
    return "png/drizzle.png";
  } else if (mainCondition.includes('Mist')) {
    return "png/mist.png";
  } else if (mainCondition.includes('Rain')) {
    return "png/rain.png";
  } else if (mainCondition.includes('Snow')) {
    return "png/snow.png";
  } else if (mainCondition.includes('Clear')) {
    return "png/sun.png";
  }

}

return (
  <>
    <div className="card">
      <div className="botton">
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='enter city name'
            value={city}
            onChange={handleChange}
            spellCheck='false'
          />
          <button type="submit"><img src="png/search.png" alt="search icon" /></button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {weatherData && (
        <div className="weather">
          <img src={getWeatherIcon()} className="weather-icon" alt="weather icon" />
          <h1 className="h1">{Math.round(weatherData.main.temp / 10)}°c</h1>
          <h1 className="city">{weatherData.name}</h1>
          <div className="details">
            <div className="colsData">
              <img src="png/humidity.png" className="humidity-icon" alt="humidity icon" />
              <div>
                <p className='humidity'>{weatherData.main.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="cols">
              <img src="png/wind.png" className="wind-icon" alt="wind icon" />
              <div>
                <p className='wind'>{weatherData.wind.speed} km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  </>
);
};

export default App;

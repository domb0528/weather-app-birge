import React, { useState } from 'react';
import Header from "../components/header";
import styles from "../styles/Home.module.css";

const Search = () => {
  const [locationKey, setLocationKey] = useState('');
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Searching and using a fetch with APIkey to use Accuweather API

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const locationResponse = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${'DgPDqeQZ4RE01jOnKCyMHhlyEB8hGaSJ'}&q=${query}&details=true`);
      if (!locationResponse.ok) {
        throw new Error('Failed to fetch location data');
      }
      const locationData = await locationResponse.json();
      if (locationData.length === 0) {
        throw new Error('No matching location found');
      }

      // Using fetch with location key to allow the api to render specific location data

      const locationKey = locationData[0].Key;

      const forecastResponse = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${'DgPDqeQZ4RE01jOnKCyMHhlyEB8hGaSJ'}`);
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      // This will get the Daily Forecast data from the API

      const forecastData = await forecastResponse.json();
      setDailyForecasts(forecastData.DailyForecasts);
      setLocationKey(locationKey);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setDailyForecasts([]);
    setLocationKey('');
    setError(null);
  };

  return (
    <div>
        <Header></Header>
        <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Weather Friend Search Page! Please enter your city's name and your 5 day weather forecast will show below! 
        </h1>


        <div className={styles.searchBar}>
      <input
        type="text" 
        placeholder="Enter city name" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleReset}>Reset</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {dailyForecasts.length > 0 && (
        // the h2 tag will now show the query result instead of just the 5 day forecast so the user can see which city they entered
        <div className={styles.weatherResults}>
          <h2> {query ? `5-Day Daily Forecasts for ${query}` : ' 5-Day Daily Forecast'}</h2>
          {dailyForecasts.map((forecast, index) => (
            <div key={index}>
            <p>Date: {forecast.Date}</p>
            <p>Temperature: {forecast.Temperature.Maximum.Value} {forecast.Temperature.Maximum.Unit}</p>
            <p>Day Weather: {forecast.Day.IconPhrase}</p>
            <p>Night Weather: {forecast.Night.IconPhrase}</p>
            </div>
          ))}
        </div>
      )}
      </main>
    </div>
  );
};

export default Search;
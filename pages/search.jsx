import React, { useState } from 'react';
import Header from "../components/header";
import styles from "../styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);


const Search = (props) => {
  const [locationKey, setLocationKey] = useState('');
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

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

      const locationKey = locationData[0].Key;

      const forecastResponse = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${'DgPDqeQZ4RE01jOnKCyMHhlyEB8hGaSJ'}`);
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

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

  

  const addToFavorites = (props) => {
    const favorite = {
      city: query,
      forecasts: dailyForecasts
    };
    setFavorites([...favorites, favorite]);
    props.onAddToFavorites(favorites);
  };

  return (
    <div>
      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
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
          <div className={styles.weatherResults}>
            <h2> {query ? `5-Day Daily Forecasts for ${query}` : ' 5-Day Daily Forecast'} <button onClick={addToFavorites}>Add to Favorites</button>
            </h2>
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

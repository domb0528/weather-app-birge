import React from 'react';

const Favorites = ({ location }) => {
  const favorites = location.state.favorites;

  return (
    <div>
      <h1>Your Favorites</h1>
      {/* Display favorites data here */}
    </div>
  );
};

export default Favorites;
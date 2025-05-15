import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/FavoritesPage.css'; // Import CSS

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.REACT_APP_API_URL}/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFavorites(res.data))
      .catch(err => console.error('Error loading favorites:', err));
  }, []);

  if (!token) return <p>Please log in to view your favorites.</p>;

  return (
    <div className="favorites-container">
      <h2>⭐ My Favorite Movies</h2>

      {favorites.length === 0 ? (
        <p>You have no favorite movies yet.</p>
      ) : (
        <ul className="favorites-list">
          {favorites.map(movie => (
            <li key={movie._id} className="favorite-card">
              <Link to={`/movies/${movie._id}`}>
                {movie.poster && movie.poster.trim() !== "" && (
                  <img src={movie.poster} alt={movie.title} />
                )}
                <p><strong>{movie.title}</strong> ({movie.year})</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;

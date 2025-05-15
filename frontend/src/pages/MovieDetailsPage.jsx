import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import '../styles/MovieDetailsPage.css'; // Import CSS

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/movies`)
      .then(res => {
        const found = res.data.find(m => m._id === id);
        setMovie(found);
      })
      .catch(err => console.error('Error loading movie:', err));
  }, [id]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/average/${id}`)
      .then(res => setAverageRating(res.data.average))
      .catch(err => console.error('Error loading average rating:', err));
  }, [id, refreshReviews]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const isFav = res.data.some(fav => fav._id === id);
        setIsFavorite(isFav);
      })
      .catch(err => console.error('Error checking favorites:', err));
  }, [id]);

  const handleReviewAdded = () => {
    setRefreshReviews(prev => prev + 1);
  };

  const handleToggleFavorite = () => {
    if (!token) {
      alert('Please log in to add to favorites');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/users/favorites/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setIsFavorite(prev => !prev);
      })
      .catch(err => {
        console.error('Error updating favorites:', err);
        alert('Failed to update favorites');
      });
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-details-container">
      <div className="movie-poster">
        <img
          src={movie.poster?.trim() ? movie.poster : '/images/no-poster.png'}
          alt={movie.title}
        />
      </div>

      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p><strong>Year:</strong> {movie.year}</p>
        <p><strong>Genres:</strong> {movie.genres?.join(', ')}</p>
        <p><strong>Directors:</strong> {movie.directors?.join(', ')}</p>
        <p><strong>IMDb:</strong> {movie.imdb?.rating ?? 'N/A'}</p>
        <p><strong>User Rating:</strong> {averageRating ?? 'No ratings yet'}</p>
        <p className="movie-plot">{movie.plot}</p>

        <div className="movie-buttons">
          {token && (
            <button
              onClick={handleToggleFavorite}
              className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
            >
              {isFavorite ? '⭐ Remove from Favorites' : '⭐ Add to Favorites'}
            </button>
          )}


          {role === 'admin' && (
            <button
              onClick={() => window.location.href = `/edit-movie/${movie._id}`}
              className="edit-button"
            >
              ✏️ Edit Movie
            </button>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <ReviewForm movieId={movie._id} onReviewAdded={handleReviewAdded} />
        <ReviewList movieId={movie._id} refreshTrigger={refreshReviews} />
      </div>
    </div>
  );
};

export default MovieDetailsPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MoviesListPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/movies`)
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error loading movies:', error));
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div style={{ padding: '30px' }}>
      <h2>🎬 Movie List</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />

      {filteredMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'flex-start'
        }}>
          {filteredMovies.map(movie => (
            <div key={movie._id} className="movie-card light-card" style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              width: '250px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {movie.poster && movie.poster.trim() !== "" && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: '100%', borderRadius: '6px', marginBottom: '10px' }}
                />
              )}
              <h3 style={{ marginBottom: '5px' }}>{movie.title}</h3>
              <p><strong>Year:</strong> {movie.year}</p>
              <p><strong>Genres:</strong> {movie.genres?.join(', ')}</p>
              <p><strong>Directors:</strong> {movie.directors?.join(', ')}</p>
              <p><strong>IMDb:</strong> {movie.imdb?.rating ?? 'N/A'}</p>
              <p style={{ fontSize: '0.9em', marginTop: '10px' }}>{movie.plot}</p>

              <Link to={`/movies/${movie._id}`}>
                <button style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesListPage;

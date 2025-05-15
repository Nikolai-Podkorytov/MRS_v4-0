import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminTable.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ms-v4-0.onrender.com';

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = () => {
    axios.get(`${API_URL}/api/movies`)
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setMovies(data);
        } else if (Array.isArray(data.movies)) {
          setMovies(data.movies);
        } else {
          console.error('Unexpected response format:', data);
          setMovies([]);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = (movieId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this movie?')) {
      axios.delete(`${API_URL}/api/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => fetchMovies())
        .catch(err => alert('Failed to delete movie.'));
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error loading movies: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Movie Manager</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Director(s)</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>{movie._id}</td>
              <td>{movie.title}</td>
              <td>
                {Array.isArray(movie.directors)
                  ? movie.directors.join(', ')
                  : movie.director || 'N/A'}
              </td>
              <td>{movie.year}</td>
              <td>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="delete-button"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieManager;

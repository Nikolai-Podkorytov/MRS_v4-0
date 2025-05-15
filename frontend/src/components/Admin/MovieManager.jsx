import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminTable.css'; // Optional: custom styles for admin tables

// Admin panel component to view and manage movie list
const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all movies from the backend
  const fetchMovies = () => {
    axios.get('/api/movies')
      .then(response => {
        setMovies(response.data);
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

  // Delete a movie by ID
  const handleDelete = (movieId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this movie?')) {
      axios.delete(`/api/movies/${movieId}`, {
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

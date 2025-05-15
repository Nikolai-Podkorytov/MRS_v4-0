import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddMoviePage.css'; // Import CSS

import Swal from 'sweetalert2';

function AddMoviePage() {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: '',
    releaseYear: '',
    rating: '',
    poster: '',
    plot: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ?? ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const movieData = {
      title: formData.title,
      year: parseInt(formData.releaseYear),
      genres: formData.genre.split(',').map(g => g.trim()),
      directors: formData.director.split(',').map(d => d.trim()),
      poster: formData.poster,
      plot: formData.plot,
      imdb: {
        rating: parseFloat(formData.rating)
      }
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/movies`, movieData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Movie added successfully!'
      });

      navigate('/');
    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add movie:'
      });


    }
  };

  return (
    <div className="add-movie-container">
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <div>
          <label>Title:</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Director(s):</label><br />
          <input type="text" name="director" value={formData.director} onChange={handleChange} required />
        </div>
        <div>
          <label>Genre(s):</label><br />
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <label>Release Year:</label><br />
          <input type="number" name="releaseYear" value={formData.releaseYear || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>IMDb Rating:</label><br />
          <input type="number" step="0.1" name="rating" value={formData.rating || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Poster URL:</label><br />
          <input type="text" name="poster" value={formData.poster} onChange={handleChange} />
        </div>
        <div>
          <label>Plot:</label><br />
          <textarea name="plot" value={formData.plot} onChange={handleChange} rows="4" />
        </div>
        <button type="submit" className="add-movie-button">
          Add Movie
        </button>
      </form>
    </div>
  );
}

export default AddMoviePage;

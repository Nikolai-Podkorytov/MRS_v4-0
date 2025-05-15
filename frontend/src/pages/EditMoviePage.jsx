import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditMoviePage.css'; // Import CSS

import Swal from 'sweetalert2';

const EditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    genres: '',
    directors: '',
    poster: '',
    plot: '',
    rating: ''
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies`)
      .then(res => {
        const found = res.data.find(m => m._id === id);
        setMovie(found);
        setFormData({
          title: found.title,
          year: found.year,
          genres: found.genres.join(', '),
          directors: found.directors.join(', '),
          poster: found.poster,
          plot: found.plot,
          rating: found.imdb?.rating ?? ''
        });
      })
      .catch(err => console.error('Error loading movie:', err));
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/movies/${id}`,
        {
          title: formData.title,
          year: parseInt(formData.year),
          genres: formData.genres.split(',').map(g => g.trim()),
          directors: formData.directors.split(',').map(d => d.trim()),
          poster: formData.poster,
          plot: formData.plot,
          imdb: {
            rating: parseFloat(formData.rating)
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );


      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Movie updated successfully!'
      });

      navigate(`/movies/${id}`);
    } catch (err) {
      console.error('Error updating movie:', err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update movie'
      });

    }
  };

  if (!movie) return <p>Loading movie data...</p>;

  return (
    <div className="edit-movie-container">
      <h2>Edit Movie</h2>
      <form onSubmit={handleSubmit} className="edit-movie-form">
        <div>
          <label>Title:</label><br />
          <input name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Year:</label><br />
          <input name="year" type="number" value={formData.year} onChange={handleChange} required />
        </div>

        <div>
          <label>Genres (comma-separated):</label><br />
          <input name="genres" value={formData.genres} onChange={handleChange} required />
        </div>

        <div>
          <label>Directors (comma-separated):</label><br />
          <input name="directors" value={formData.directors} onChange={handleChange} required />
        </div>

        <div>
          <label>Poster URL:</label><br />
          <input name="poster" value={formData.poster} onChange={handleChange} />
        </div>

        <div>
          <label>Plot:</label><br />
          <textarea name="plot" value={formData.plot} onChange={handleChange} rows="4" />
        </div>


        <div>
          <label>IMDb Rating:</label><br />
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-button">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditMoviePage;

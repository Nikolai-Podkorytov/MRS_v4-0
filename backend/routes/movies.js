// routes/movies.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all movies (accessible to everyone)
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a movie (only for critic and admin)
router.post('/', authMiddleware, roleMiddleware('critic', 'admin'), async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: 'Error adding movie' });
  }
});

// Update a movie (only for admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Update main fields
    movie.title = req.body.title;
    movie.year = req.body.year;
    movie.genres = req.body.genres;
    movie.directors = req.body.directors;
    movie.poster = req.body.poster;
    movie.plot = req.body.plot;

    // Update nested field imdb.rating
    if (req.body.imdb?.rating !== undefined) {
      movie.imdb.rating = req.body.imdb.rating;
    }

    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(400).json({ message: 'Error updating movie' });
  }
});

// Delete a movie (only for admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting movie' });
  }
});

module.exports = router;

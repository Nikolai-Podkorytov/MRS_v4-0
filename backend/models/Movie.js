const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genres: [String],
  directors: [String],
  poster: String,
  plot: String,
  imdb: {
    rating: Number
  }
}, { collection: 'movies' }); // Important: explicitly specify the collection

module.exports = mongoose.model('Movie', movieSchema);

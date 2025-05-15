const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No access' });
    }

    const users = await User.find().select('-password'); // without passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Get favorite movies
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving favorites' });
  }
});

// Add/remove movie from favorites
router.post('/favorites/:movieId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const movieId = req.params.movieId;

    const index = user.favorites.indexOf(movieId);
    if (index === -1) {
      user.favorites.push(movieId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ message: 'Favorites updated', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error updating favorites' });
  }
});

// Delete a user (only for admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No access' });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;

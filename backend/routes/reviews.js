const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authMiddleware } = require('../middleware/auth');

// Add a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const sanitizeHtml = require('sanitize-html'); // 👈 add at the top of the file

    const { movieId, text, rating } = req.body;

    // 👇 Clean text from HTML tags
    const cleanText = sanitizeHtml(text, {
      allowedTags: [], // prohibit all HTML tags
      allowedAttributes: {}
    });

    const review = new Review({
      movieId,
      userId: req.user.userId,
      user: req.user.username,
      text: cleanText,
      rating
    });

    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No permission to delete' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'No permission to edit' });
    }

    review.text = text;
    review.rating = rating;
    await review.save();

    res.json({ message: 'Review updated', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ New route: Get the average rating
router.get('/average/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId });

    if (reviews.length === 0) {
      return res.json({ average: null });
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / reviews.length).toFixed(1);

    res.json({ average });
  } catch (err) {
    console.error('Error calculating average rating:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews (only for admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No access' });
    }

    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error retrieving reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminTable.css'; // Custom styles for admin table

// Admin panel component to manage all reviews
const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reviews from the backend
  const fetchReviews = () => {
    const token = localStorage.getItem('token');
    axios.get('/api/reviews', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete a review by ID
  const handleDelete = (reviewId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this review?')) {
      axios.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => fetchReviews())
        .catch(err => alert('Failed to delete review.'));
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Review Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map(review => (
            <tr key={review._id}>
              <td>{review._id}</td>
              <td>{review.movieId}</td>
              <td>{review.user}</td>
              <td>{review.rating}</td>
              <td>{review.text}</td>
              <td>
                <button
                  onClick={() => handleDelete(review._id)}
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

export default ReviewManager;

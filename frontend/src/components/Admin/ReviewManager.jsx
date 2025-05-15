import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminTable.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://mrs-v4-0.onrender.com';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = () => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          console.error('Invalid data format:', data);
          setReviews([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = (reviewId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this review?')) {
      axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
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
          {Array.isArray(reviews) && reviews.map(review => (
            <tr key={review._id}>
              <td>{review._id}</td>
              <td>{review.movieId || 'N/A'}</td>
              <td>{review.user || 'N/A'}</td>
              <td>{review.rating ?? 'N/A'}</td>
              <td>{review.text || review.comment || 'N/A'}</td>
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Review list component
const ReviewList = ({ movieId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  const currentUsername = localStorage.getItem('username');
  const currentUserRole = localStorage.getItem('role');

  // Fetch reviews for the movie
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/${movieId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('Error loading reviews:', err));
  }, [movieId, refreshTrigger]);

  // Delete a review
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this review?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      alert('Failed to delete review: ' + (err.response?.data?.message || err.message));
    }
  };

  // Start editing a review
  const startEdit = (review) => {
    setEditingId(review._id);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditRating(5);
  };

  // Save edited review
  const saveEdit = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/reviews/${editingId}`, {
        text: editText,
        rating: editRating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(reviews.map(r => r._id === editingId ? res.data.review : r));
      cancelEdit();
    } catch (err) {
      alert('Failed to save review: ' + (err.response?.data?.message || err.message));
    }
  };

  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          backgroundColor: '#fdfdfd',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          {editingId === review._id ? (
            <>
              <label><strong>Rating:</strong></label>
              <input
                type="number"
                min="1"
                max="10"
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
                style={{ marginBottom: '10px', padding: '5px', width: '60px' }}
              />
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows="3"
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <div>
                <button onClick={saveEdit} style={{ marginRight: '10px' }}>💾 Save</button>
                <button onClick={cancelEdit}>❌ Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Rating:</strong> {review.rating}/10</p>
              <p>{review.text}</p>
              <p style={{ fontSize: '0.85em', color: '#666' }}>By: {review.user}</p>

              {(review.user === currentUsername || currentUserRole === 'admin') && (
                <div style={{ marginTop: '10px' }}>
                  {review.user === currentUsername && (
                    <button onClick={() => startEdit(review)} style={{ marginRight: '10px' }}>✏️ Edit</button>
                  )}
                  <button onClick={() => handleDelete(review._id)}>🗑 Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

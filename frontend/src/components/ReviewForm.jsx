import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Review form component
const ReviewForm = ({ movieId, onReviewAdded }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const token = localStorage.getItem('token');

  // ⛔ Не показывать форму, если пользователь не авторизован
  if (!token) {
    return (
      <p style={{ marginTop: '30px', fontStyle: 'italic', color: '#555' }}>
        🔐 Войдите, чтобы оставить отзыв.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `https://mrs-v4-0.onrender.com/api/reviews`,
        { movieId, text, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setText('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Review Submission Failed',
        text: error.response?.data?.message || error.message
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="light-card"
      style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}
    >
      <h3 style={{ marginBottom: '20px' }}>Leave a Review</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1–10):</label>
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          style={{ padding: '8px', width: '100%', fontSize: '16px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Your Review:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          required
          style={{
            padding: '10px',
            width: '100%',
            fontSize: '16px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;

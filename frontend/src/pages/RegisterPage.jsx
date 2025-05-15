import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterPage.css'; // Import CSS

import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    adminCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting data:', formData);

    try {
      await axios.post('/api/auth/register', formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Registration successful!'
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Registration error'
      });

    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2 className="register-title">Register</h2>

      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        className="register-input"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="register-input"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="register-input"
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="register-select"
      >
        <option value="user">User</option>
        <option value="critic">Critic</option>
        <option value="admin">Admin</option>
      </select>

      {formData.role === 'admin' && (
        <input
          name="adminCode"
          type="password"
          placeholder="Admin Secret Code"
          value={formData.adminCode}
          onChange={handleChange}
          required
          className="register-input"
        />
      )}

      <button type="submit" className="register-button">
        Register
      </button>
    </form>
  );
};

export default RegisterPage;

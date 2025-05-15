import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminTable.css'; // Custom styles for admin table

// Admin panel component to display and manage users
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users from the backend
  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user by ID
  const handleDelete = (userId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => fetchUsers())
        .catch(err => alert('Failed to delete user.'));
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleDelete(user._id)}
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

export default UserList;

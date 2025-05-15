import React from 'react';
import UserList from '../components/Admin/UserList';
import MovieManager from '../components/Admin/MovieManager';
import ReviewManager from '../components/Admin/ReviewManager';

// Main admin panel page that includes user, movie, and review management
const AdminPanel = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>

      {/* Section: Manage Users */}
      <section style={{ marginBottom: '40px' }}>
        <UserList />
      </section>

      {/* Section: Manage Movies */}
      <section style={{ marginBottom: '40px' }}>
        <MovieManager />
      </section>

      {/* Section: Manage Reviews */}
      <section>
        <ReviewManager />
      </section>
    </div>
  );
};

export default AdminPanel;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MoviesListPage from './pages/MoviesListPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddMoviePage from './pages/AddMoviePage';
import ProfilePage from './pages/ProfilePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import EditMoviePage from './pages/EditMoviePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPanel from './pages/AdminPanel';

import RequireAdmin from './components/RequireAdmin';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <Navbar /> {}

      <main style={{ padding: '30px' }}>
        <Routes>
          <Route path="/" element={<MoviesListPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-movie" element={<AddMoviePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/edit-movie/:id" element={<EditMoviePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register } from './pages/Auth';
import Home from './pages/Home';
import ContentPage from './pages/ContentPage';
import MyList from './pages/MyList';
import Plan from './pages/Plan';
import Profiles from './pages/Profiles';
import Account from './pages/Account';
import Help from './pages/Help';
import TransferProfile from './pages/TransferProfile';
import Dashboard from './pages/Admin/Dashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/help" element={<Help />} />
        <Route path="/transfer-profile" element={<ProtectedRoute><TransferProfile /></ProtectedRoute>} />
        <Route path="/" element={
          localStorage.getItem('token') ? <Home /> : <Navigate to="/login" replace />
        } />
        <Route path="/movies" element={
          <ProtectedRoute>
            <ContentPage type="movie" title="Películas" />
          </ProtectedRoute>
        } />
        <Route path="/series" element={
          <ProtectedRoute>
            <ContentPage type="series" title="Series" />
          </ProtectedRoute>
        } />
        <Route path="/new" element={
          <ProtectedRoute>
            <ContentPage type="all" title="Novedades Populares" initialQuery="popular" />
          </ProtectedRoute>
        } />
        <Route path="/category/:query" element={
          <ProtectedRoute>
            <ContentPage type="movie" />
          </ProtectedRoute>
        } />
        <Route path="/list" element={
          <ProtectedRoute>
            <MyList />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

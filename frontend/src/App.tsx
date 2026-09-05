import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Placeholder } from './pages/Placeholder';
import { Discover } from './pages/Discover';
import { WorldMemory } from './pages/WorldMemory';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Arena } from './pages/Arena';
import { Play } from './pages/Play';
import { Progression } from './pages/Progression';
import { WorldMapPage } from './pages/WorldMapPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Fullscreen Game Route */}
          <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><WorldMapPage /></ProtectedRoute>} />

          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="discover" element={<Discover />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="world" element={<ProtectedRoute><WorldMemory /></ProtectedRoute>} />
            <Route path="arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
            <Route path="progression" element={<ProtectedRoute><Progression /></ProtectedRoute>} />
            <Route path="create" element={<ProtectedRoute><Placeholder title="Create" /></ProtectedRoute>} />
            <Route path="community" element={<ProtectedRoute><Placeholder title="Community" /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;

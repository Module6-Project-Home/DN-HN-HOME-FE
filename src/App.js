// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';
import Login from './components/auth/Login';
import Header from './components/property/Header';
import Footer from './components/property/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from './components/auth/AuthContext';
import HostDashboard from './components/host/HostDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Header />
                    <Routes>
                        <Route path="/home" element={<PropertyList />} />
                        <Route path="/properties/:id" element={<PropertyDetail />} />
                        <Route path="/post" element={<PostForm />} />
                        <Route path="/login" element={<Login />} />

                        {/* Routes protected by roles */}
                        <Route
                            path="/host/*"
                            element={<PrivateRoute element={<HostDashboard />} requiredRole="ROLE_HOST" />}
                        />
                        <Route
                            path="/admin/*"
                            element={<PrivateRoute element={<AdminDashboard />} requiredRole="ROLE_ADMIN" />}
                        />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;

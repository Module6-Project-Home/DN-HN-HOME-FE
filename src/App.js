import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';

import Login from './components/auth/Login'; // import the login component


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from "./components/auth/AuthContext";
import HostDashboard from "./components/host/HostDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import ListMyHomestay from "./components/host/ListMyHomestay";
import HeaderAdmin from "./components/host/layout/HeaderAdmin"; // Import AdminDashboard component

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Routes>

                        <Route path="/home" element={<PropertyList />} />
                        <Route path="/properties/:id" element={<PropertyDetail />} />
                        <Route path="/post" element={<PostForm />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/host/dashboard" element={<HostDashboard />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Route for Admin */}
                        <Route path="/host/listMyHome" element={<ListMyHomestay />} />
                        <Route path="/host/header" element={<HeaderAdmin />} />


                    </Routes>
                </div>
            </Router>
        </AuthProvider>

    );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';
import Login from './components/auth/Login'; // import the login component
import Header from "./components/property/Header";
import Footer from "./components/property/Footer";
import BookingForm from "./components/booking/BookingForm"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from "./components/auth/AuthContext";
import HostDashboard from "./components/host/HostDashboard";
import AdminDashboard from "./components/admin/AdminDashboard"; // Import AdminDashboard component

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Header />
                    <Routes>
                        <Route path="/home" element={<PropertyList />} />
                        <Route path="/property/detail/:id" element={<PropertyDetail />} />
                        <Route path="/booking/:id" element={<BookingForm />} />
                        <Route path="/post" element={<PostForm />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/host/dashboard" element={<HostDashboard />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Route for Admin */}
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;

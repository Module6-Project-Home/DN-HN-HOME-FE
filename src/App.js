import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';
import Header from "./components/property/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/property/Footer";
import './App.css';
import RegisterForm from "./components/user/Register";

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <Routes>
                    <Route path="/home" element={<PropertyList />} />
                    <Route path="/properties/:id" element={<PropertyDetail />} />
                    <Route path="/post" element={<PostForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>
                <Footer></Footer>
            </div>
        </Router>
    );
};

export default App;

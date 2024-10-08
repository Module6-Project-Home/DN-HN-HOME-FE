import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';
import Header from "./components/property/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/property/Footer";
import './App.css';
import BookingForm from "./components/booking/BookingForm";
const App = () => {
    return (

        <Router>
            <div className="app-container">
                <Header />
                <Routes>
                    <Route path="/home" element={<PropertyList />} />
                    <Route path="/properties/detail/:id" element={<PropertyDetail />} />
                    <Route path="/booking/:id" element={<BookingForm />} />
                    <Route path="/post" element={<PostForm />} />
                </Routes>
                <Footer></Footer>
            </div>
        </Router>
    );
};

export default App;

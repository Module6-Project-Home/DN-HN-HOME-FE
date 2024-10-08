import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const App = () => {
    return (
        <Router>
            <div className="app-container"><Routes>
                    <Route path="/home" element={<PropertyList />} />
                    <Route path="/properties/:id" element={<PropertyDetail />} />
                    <Route path="/post" element={<PostForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

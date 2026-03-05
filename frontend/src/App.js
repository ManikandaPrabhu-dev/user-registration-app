import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import UserList from './components/UserList';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <div className="nav-container">
                        <Link to="/" className="nav-logo">
                            📝 User Registration
                        </Link>
                        <div className="nav-links">
                            <Link to="/" className="nav-link">Register</Link>
                            <Link to="/users" className="nav-link">View Users</Link>
                        </div>
                    </div>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/" element={<RegistrationForm />} />
                        <Route path="/users" element={<UserList />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
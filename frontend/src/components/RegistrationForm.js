import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    
    // UI state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear field error when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        // Confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        // Phone validation (optional)
        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone must be 10 digits';
        }
        
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setLoading(true);
        setServerMessage({ type: '', text: '' });
        
        try {
            // Send data to backend
            const response = await API.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });
            
            // Success!
            setServerMessage({ 
                type: 'success', 
                text: response.data.message 
            });
            
            // Clear form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: ''
            });
            
            // Redirect to users list after 2 seconds
            setTimeout(() => {
                navigate('/users');
            }, 2000);
            
        } catch (error) {
            // Handle error
            const message = error.response?.data?.message || 'Registration failed';
            setServerMessage({ type: 'error', text: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <h2>Create Account</h2>
            
            {serverMessage.text && (
                <div className={`message ${serverMessage.type}`}>
                    {serverMessage.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="your@email.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                    <label>Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                        placeholder="At least 6 characters"
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                        placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
                
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="10 digit mobile number"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            
            <p className="login-link">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
};

export default RegistrationForm;
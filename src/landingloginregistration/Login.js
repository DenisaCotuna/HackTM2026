import React, { useState } from 'react';
import { Form, Button, Container, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css';
import LoginLogo from './logo.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            setErrors({});
            console.log('Form submitted:', { email, password });
        }
    };
    return (
        <div className='login-wrapper'>
            <div className='login-form-container'>
                <div className='text-center mb-2'>
                    <img src={LoginLogo} alt='App Logo' className='login-logo' />
                </div>
                <h2 className="login-title">Log in</h2>
                    <Form onSubmit={handleSubmit} className='login-form'>
                        <Form.Group className="mb-3" controlId='formBasicEmail'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!errors.email} />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formBasicPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!errors.password} />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className='login-button'>
                            Log in
                        </Button>
                        <div className='text-center'>
                            <p>Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </Form>
                </div>
            </div>
    );
}
export default Login;
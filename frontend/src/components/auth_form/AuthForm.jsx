'use client';

import { useState } from 'react';
import styles from './AuthForm.module.css';
import { Eye, EyeOff, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setToastMessage('Login successful!');
                setToastType('success');
                setToastOpen(true);
                // Redirect to home page after a short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            setToastMessage(error.message || 'An error occurred');
            setToastType('error');
            setToastOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            username: '',
            password: '',
            name: '',
            confirmPassword: ''
        });
    };

    return (
        <Toast.Provider swipeDirection="right">
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={styles.passwordToggle}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    )}
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? <Loader className={styles.spinner} /> : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className={styles.toggleText}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleForm} className={styles.toggleButton}>
                        {isLogin ? 'Create a new account' : 'Login'}
                    </button>
                </p>
            </div>
            <Toast.Root className={styles.toastRoot} open={toastOpen} onOpenChange={setToastOpen}>
                <Toast.Title className={styles.toastTitle}>
                    {toastType === 'success' ? 'Success' : 'Error'}
                </Toast.Title>
                <Toast.Description className={styles.toastDescription}>
                    {toastMessage}
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
    );
}


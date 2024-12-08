'use client';

import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import styles from './AuthForm.module.css';
import API_BASE_URL from '../../pages/Admin/config';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', status: '' });

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
            const response = await axios.post(`${API_BASE_URL}/api/users${isLogin ? '/login' : ''}`, formData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data.user)); // hoặc response.data.token nếu có token
            }
            setToastMessage({
                title: 'Success',
                description: isLogin ? 'Login successful!' : 'Registration successful!',
                status: 'success'
            });
            setToastOpen(true);
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            setToastMessage({
                title: 'Error',
                description: error.response?.data?.message || 'An error occurred',
                status: 'error'
            });
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
            name: '',
            username: '',
            password: '',
        });
    };

    return (
        <Toast.Provider swipeDirection="right">
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Login QAirline' : 'Register QAirline'}</h2>
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
            <Toast.Root
                className={`${styles.toastRoot} ${styles[toastMessage.status]}`}
                open={toastOpen}
                onOpenChange={setToastOpen}
            >
                <Toast.Title className={styles.toastTitle}>{toastMessage.title}</Toast.Title>
                <Toast.Description className={styles.toastDescription}>
                    {toastMessage.description}
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
    );
}


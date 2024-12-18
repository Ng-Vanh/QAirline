'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import styles from './Login.module.css';

export default function Login() {
    const { login, signup } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isAdminRoute, setIsAdminRoute] = useState(false);
    const [loginText, setLoginText] = useState();
    const [registerText, setRegisterText] = useState();
    const [role, setRole] = useState();

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


    useEffect(() => {
        window.scrollTo(0, 0);
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
            setLoginText("Admin Login");
            setRegisterText("Admin Register");
            setIsAdminRoute(true);
            setRole('admin');
        }
        else {
            setLoginText("Login to QAirline");
            setRegisterText("Register to QAirline");
            setIsAdminRoute(false);
            setRole('user');
        }   
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Perform login or signup
            const result = isLogin
                ? await login(formData.username, formData.password)
                : await signup(formData.name, formData.username, formData.password, role);

            if (result.success) {
                setToastMessage({
                    title: 'Success',
                    description: isLogin ? 'Login successful!' : 'Registration successful!',
                    status: 'success',
                });
                setToastOpen(true);

                // Redirect back to the saved path or home
                const redirectTo = isAdminRoute ? '/admin' : (location.state?.from || '/');
                const thePrevState = location.state?.prevState || {};

                console.log("Redirecting to: ", redirectTo);
                navigate(redirectTo, {
                    state: {
                        from: location.pathname,
                        prevState: thePrevState
                    },
                });

            } else {
                setToastMessage({
                    title: 'Error',
                    description: result.error,
                    status: 'error',
                });
                setToastOpen(true);
            }
        } catch (error) {
            setToastMessage({
                title: 'Error',
                description: error.message || 'An error occurred during the process',
                status: 'error',
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
                    <h2>{isLogin ? `${loginText}` : `${registerText}`}</h2>
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
                                type={showPassword ? 'text' : 'password'}
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
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
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

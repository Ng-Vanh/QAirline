'use client';

import { Plane, Compass, Bell, Newspaper, User, LogIn } from 'lucide-react';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo1-removebg-preview.png';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user); // Nếu có user thì isLoggedIn = true
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false); // Cập nhật trạng thái
        window.location.href = '/login';
    };

    const navigateToMyBooking = () => {
        window.location.href = '/my-booking';
    };

    const navigateToHome = () => {
        window.location.href = '/';
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo} onClick={navigateToHome}>
                <img
                    src={logo}
                    alt="QAirline Logo"
                    className={styles.logoImage}
                />
            </div>
            <ul className={styles.navItems}>
                <li>
                    <button onClick={() => scrollToSection('home')}>
                        <Plane className={styles.icon} /> Booking
                    </button>
                </li>
                <li>
                    <button onClick={() => scrollToSection('explore')}>
                        <Compass className={styles.icon} /> Explore
                    </button>
                </li>
                <li>
                    <button onClick={() => scrollToSection('news')}>
                        <Newspaper className={styles.icon} /> News
                    </button>
                </li>
                <li>
                    <button onClick={() => scrollToSection('alerts')}>
                        <Bell className={styles.icon} /> Alerts
                    </button>
                </li>
            </ul>
            <div className={styles.userSection}>
                {isLoggedIn ? (
                    <>
                        <button
                            className={styles.userButton}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <User className={styles.userIcon} />
                        </button>
                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                <button>Profile</button>
                                <button onClick={navigateToMyBooking}>My booking</button>
                                <button>Settings</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        className={styles.loginButton}
                        onClick={navigateToLogin}
                    >
                        Login
                        <LogIn className={styles.icon} />
                    </button>
                )}
            </div>
        </nav>
    );
}

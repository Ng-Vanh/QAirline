'use client';

import { Plane, Compass, Bell, Newspaper, User, LogIn, Gift } from 'lucide-react';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';
import logo from '../../assets/qLOGO.png';

const isPositionRelative = () => {
    return (window.location.pathname === '/flights' || window.location.pathname === '/my-bookings')
}

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // state cho mobile menu

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            setIsLoggedIn(true);
            setUser(userObj);
        } else {
            setIsLoggedIn(false);
        }

        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn(`Element with ID ${targetId} not found.`);
            }
        }
    }, []);

    const scrollToSection = (id) => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/#') || currentUrl.endsWith('/')) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn(`Element with ID ${id} not found.`);
            }
        } else {
            window.location.href = `/#${id}`;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    const navigateToMyBooking = () => {
        window.location.href = '/my-bookings';
    };

    const navigateToHome = () => {
        window.location.href = '/';
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };
    const navigateToFlightSearch = () => {
        window.location.href = '/flights';
    }

    return (
        <nav className={`${styles.navbar} ${isPositionRelative() ? styles.position_relative : ''}`}>
            <div className={styles.logo} onClick={navigateToHome}>
                <img
                    src={logo}
                    alt="QAirline Logo"
                    className={styles.logoImage}
                />
            </div>

            <div className={styles.navItemsContainer}>
                <ul className={styles.navItems}>
                    <li>
                        <button onClick={navigateToFlightSearch}>
                            <Plane className={styles.icon} /> Flights
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('promotions')}>
                            <Gift className={styles.icon} /> Promotion
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('explore')}>
                            <Compass className={styles.icon} /> Explore
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('alerts')}>
                            <Bell className={styles.icon} /> Alerts
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('news')}>
                            <Newspaper className={styles.icon} /> News
                        </button>
                    </li>
                </ul>
            </div>

            <div className={styles.userSection}>
                {isLoggedIn ? (
                    <>
                        <button
                            className={styles.userButton}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <p>{user?.name}</p>
                            <User className={styles.userIcon} />
                        </button>
                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                <button onClick={navigateToMyBooking}>My booking</button>
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
                        <User className={styles.userIcon} />
                    </button>
                )}
            </div>

            {/* Nút menu cho mobile */}
            <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(true)}>
                ☰
            </button>

            {/* Panel trượt bên phải trên mobile */}
            <div className={`${styles.mobileNavPanel} ${isMenuOpen ? styles.open : ''}`}>
                <button className={styles.closeButton} onClick={() => setIsMenuOpen(false)}>×</button>
                <ul className={styles.mobileNavItems}>
                    <li><button onClick={navigateToFlightSearch}>Flights</button></li>
                    <li><button onClick={() => scrollToSection('promotions')}>Promotion</button></li>
                    <li><button onClick={() => scrollToSection('explore')}>Explore</button></li>
                    <li><button onClick={() => scrollToSection('alerts')}>Alerts</button></li>
                    <li><button onClick={() => scrollToSection('news')}>News</button></li>
                    {isLoggedIn ? (
                        <>
                            <li><button onClick={navigateToMyBooking}>My booking</button></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <li><button onClick={navigateToLogin}>Login</button></li>
                    )}
                </ul>
            </div>

        </nav>
    );
}
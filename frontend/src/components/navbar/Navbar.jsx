'use client';

import { Plane, Compass, Bell, Newspaper, User, Gift } from 'lucide-react';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/qLOGO.png';

const isPositionRelative = () => {
    return window.location.pathname === '/flights' || window.location.pathname === '/bookings';
};

export default function Navbar() {
    const { isAuthenticated, name, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginRedirect = () => {
        setIsDropdownOpen(false);
        navigate('/login', {
            state: {
                from: location.pathname,
                prevState: {

                },
            },
        });
    };

    const handleLogOut = () => {
        setIsDropdownOpen(false);
        logout();
        setIsDropdownOpen(false);
    }

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
            navigate(`/#${id}`);
        }
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    // Restore state if redirected back
    // useEffect(() => {
    //     const prevState = location.state?.prevState || {};
    //     console.log("useeffect navbar: ", prevState)
    //     if (prevState.bomba !== undefined) {
    //         console.log("effet bomba: ", prevState.bomba);
    //     }
    // }, [location.state?.prevState]);

    // Close dropdown automatically after login

    return (
        <nav className={`${styles.navbar} ${isPositionRelative() ? styles.position_relative : ''}`}>
            <div className={styles.logo} onClick={() => navigateTo('/')}>
                <img src={logo} alt="QAirline Logo" className={styles.logoImage} />
            </div>

            <div className={styles.navItemsContainer}>
                <ul className={styles.navItems}>
                    <li>
                        <button onClick={() => navigateTo('/flights')}>
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
                {isAuthenticated ? (
                    <>
                        <button
                            className={styles.userButton}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <p>{name}</p>
                            <User className={styles.userIcon} />
                        </button>
                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                <button onClick={() => navigateTo('/bookings')}>My booking</button>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    </>
                ) : (
                    <button className={styles.loginButton} onClick={handleLoginRedirect}>
                        Login
                        <User className={styles.userIcon} />
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(true)}>
                ☰
            </button>

            {/* Sliding Panel for Mobile */}
            <div className={`${styles.mobileNavPanel} ${isMenuOpen ? styles.open : ''}`}>
                <button className={styles.closeButton} onClick={() => setIsMenuOpen(false)}>
                    ×
                </button>
                <ul className={styles.mobileNavItems}>
                    <li>
                        <button onClick={() => navigateTo('/flights')}>Flights</button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('promotions')}>Promotion</button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('explore')}>Explore</button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('alerts')}>Alerts</button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('news')}>News</button>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <button onClick={() => navigateTo('/bookings')}>My booking</button>
                            </li>
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button onClick={handleLoginRedirect}>Login</button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

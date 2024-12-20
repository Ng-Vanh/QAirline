'use client';

import { Plane, Compass, Bell, Newspaper, User, Gift } from 'lucide-react';
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/qLOGO.png';

const isPositionRelative = () => {
    return window.location.pathname === '/flights' || window.location.pathname === '/bookings';
};

const isAdminLogin = () => {
    return window.location.pathname.startsWith('/admin');
}

export default function Navbar() {
    const { isAuthenticated, name, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLoginRedirect = () => {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
        if (window.location.pathname != '/login') {
            console.log("current: ", window.location.path)
            navigate('/login', {
                state: {
                    from: location.pathname,
                    prevState: {},
                },
            });
        }
    };

    const handleLogOut = () => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
        logout();
    };

    const navigateTo = (path) => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
        navigate(path);
    };

    // const scrollToSection = (id) => {
    //     setIsMenuOpen(false);
    //     setIsDropdownOpen(false);
    //     navigate(`/#${id}`);
    // };

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    
        if (window.location.pathname !== '/') {
            navigate(`/#${id}`);
            // Delay the scroll to let the navigation complete
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest',
                    });
                }
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                });
            }
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen])

    // useEffect(() => {
    //     const currentUrl = window.location.href;
    //     if (currentUrl.includes('/#') || currentUrl.endsWith('/')) {
    //         const hash = window.location.hash.replace('#', '');
    //         if (hash) {
    //             const element = document.getElementById(hash);
    //             if (element) {
    //                 element.scrollIntoView({
    //                     behavior: 'smooth',
    //                     block: 'start',
    //                     inline: 'nearest',
    //                 });
    //             }
    //         }
    //     }
    // }, [window.location.hash]);

    if (isAdminLogin()) {
        return (
            <nav className={`${styles.navbar} ${isPositionRelative() ? styles.position_relative : ''}`}>
                <div className={styles.logo} onClick={() => navigateTo('/')}>
                    <img src={logo} alt="QAirline Logo" className={styles.logoImage} />
                </div>
            </nav>
        )
    }
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

            <div className={styles.userSection} ref={dropdownRef}>
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
                                <button
                                    onClick={() => {
                                        navigateTo('/bookings');
                                    }}
                                >
                                    My booking
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogOut();
                                    }}
                                >
                                    Logout
                                </button>
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
            <button className={styles.mobileMenuButton} onClick={() => { console.log('Opening menu'); setIsMenuOpen(true); }}>
                ☰
            </button>

            {/* Sliding Panel for Mobile */}
            <div ref={mobileMenuRef} className={`${styles.mobileNavPanel} ${isMenuOpen ? styles.open : ''}`}>
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
                                <button onClick={() => {
                                    navigateTo('/bookings');
                                }}>My booking</button>
                            </li>
                            <li>
                                <button onClick={handleLogOut}>Logout</button>
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

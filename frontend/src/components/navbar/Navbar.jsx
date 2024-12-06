'use client';

import { Plane, Compass, Bell, Newspaper, User } from 'lucide-react';
import styles from './Navbar.module.css';
import { useState } from 'react';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navigateToMyBooking = () => {
        window.location.href = '/my-booking';
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>QAirline</div>
            <ul className={styles.navItems}>
                <li>
                    <button onClick={() => scrollToSection('home')}>
                        <Plane className={styles.icon} /> Ticket Booking
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
                        <button>Logout</button>

                    </div>
                )}
            </div>
        </nav>
    );
}

'use client';

import { User } from 'lucide-react';
import styles from './NavBarLogin.module.css';
import logo from '../../assets/logo1-removebg-preview.png'


export default function NavBarLogin() {
    const navigateToHome = () => {
        window.location.href = '/';
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
            <div className={styles.userSection}>
                <span className={styles.loginText}>Login</span>
                <button
                    className={styles.userButton}
                >
                    <User className={styles.userIcon} />
                </button>
            </div>
        </nav>
    );
}

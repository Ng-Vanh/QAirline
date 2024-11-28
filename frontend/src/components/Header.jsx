'use client';

import { useState } from 'react';
import { Link } from "react-router-dom";

import { UserCircle, Menu, X } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const styles = {
        header: {
            background: 'linear-gradient(to right, #0369a1, #0284c7)', // gradient background
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // shadow-md
            padding: '1rem 0',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem', // px-4
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        logo: {
            fontSize: '1.5rem', // text-2xl
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'white',
        },
        logoHighlight: {
            color: '#fbbf24', // yellow-400
        },
        nav: {
            display: 'flex',
            gap: '1.5rem', // space-x-6
        },
        navItem: {
            textDecoration: 'none',
            color: 'white',
            transition: 'color 0.3s', // transition duration-300
        },
        navItemHover: {
            color: '#fbbf24', // yellow-400
        },
        mobileNav: {
            backgroundColor: '#075985', // sky-800
            padding: '1rem', // px-4 pt-2 pb-4
        },
        mobileNavItem: {
            display: 'block',
            padding: '0.5rem 0', // py-2
            textDecoration: 'none',
            color: 'white',
            transition: 'color 0.3s',
        },
        button: {
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
        },
    };

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                <Link href="/" style={styles.logo}>
                    Q<span style={styles.logoHighlight}>Airline</span>
                </Link>
                <nav style={{ display: isMenuOpen ? 'none' : 'flex', ...styles.nav }}>
                    <Link
                        href="/flights"
                        style={styles.navItem}
                        onMouseEnter={(e) => (e.target.style.color = styles.navItemHover.color)}
                        onMouseLeave={(e) => (e.target.style.color = styles.navItem.color)}
                    >
                        Flights
                    </Link>
                    <Link
                        href="/bookings"
                        style={styles.navItem}
                        onMouseEnter={(e) => (e.target.style.color = styles.navItemHover.color)}
                        onMouseLeave={(e) => (e.target.style.color = styles.navItem.color)}
                    >
                        My Bookings
                    </Link>
                    <Link
                        href="/login"
                        style={styles.navItem}
                        onMouseEnter={(e) => (e.target.style.color = styles.navItemHover.color)}
                        onMouseLeave={(e) => (e.target.style.color = styles.navItem.color)}
                    >
                        <UserCircle style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} size={20} />
                        Login
                    </Link>
                </nav>
                <button
                    style={styles.button}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            {isMenuOpen && (
                <div style={styles.mobileNav}>
                    <nav>
                        <Link
                            href="/flights"
                            style={styles.mobileNavItem}
                            onMouseEnter={(e) => (e.target.style.color = styles.navItemHover.color)}
                            onMouseLeave={(e) => (e.target.style.color = styles.navItem.color)}
                        >
                            Flights
                        </Link>
                        <Link
                            href="/bookings"
                            style={styles.mobileNavItem}
                            onMouseEnter={(e) => (e.target.style.color = styles.navItemHover.color)}
                            onMouseLeave={(e) => (e.target.style.color = styles.navItem.color)}
                        >
                            My Bookings
                        </Link>
                        <Link
                            href="/login"
                            style={styles.mobileNavItem}
                            onMouseEnter={(e) => (e.target.style.color = styles.navItemHover.color)}
                            onMouseLeave={(e) => (e.target.style.color = styles.navItem.color)}
                        >
                            <UserCircle style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} size={20} />
                            Login
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

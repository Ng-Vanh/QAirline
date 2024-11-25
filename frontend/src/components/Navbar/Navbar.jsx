import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/flights" style={styles.link}>Flights</Link>
            <Link to="/booking" style={styles.link}>Booking</Link>
            <Link to="/login" style={styles.link}>Login</Link>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-around',
        background: '#333',
        padding: '10px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

export default Navbar;

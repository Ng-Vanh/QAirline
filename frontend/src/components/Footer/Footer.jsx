import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; 2024 Airline Management System. All Rights Reserved.</p>
            <p>Liên hệ: hotline@airline.com | 1800-123-456</p>
        </footer>
    );
};

const styles = {
    footer: {
        textAlign: 'center',
        background: '#333',
        color: '#fff',
        padding: '10px 0',
        marginTop: '20px',
    },
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';


const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            {/* Logo */}
            <div style={styles.logoContainer}>
                <img src={logo} alt="Airline Logo" style={styles.logo} />
                <span style={styles.logoText}>Airline</span>
            </div>

            {/* Liên kết chính ở giữa */}
            <div style={styles.navLinks}>
                <Link to="/" style={styles.link}>Trang chủ</Link>
                <Link to="/flights" style={styles.link}>Thông tin chuyến bay</Link>
                <Link to="/booking" style={styles.link}>Mua vé</Link>
            </div>

            {/* Đăng nhập, Đăng ký ở góc phải */}
            <div style={styles.authLinks}>
                <Link to="/login" style={styles.link}>Đăng nhập</Link>
                <Link to="/register" style={styles.link}>Đăng ký</Link>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        position: 'fixed', // Cố định ở đầu trang
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between', // Chia đều khoảng cách giữa các phần
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#1e90ff', // Màu nền
        color: '#fff',
        zIndex: 1000, // Đảm bảo Navbar luôn hiển thị trên các phần tử khác
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        height: '48px',
        marginRight: '10px',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
    },
    authLinks: {
        display: 'flex',
        gap: '15px',
    },
    link: {
        textDecoration: 'none',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'color 0.3s',
        ':hover': {
            color: '#ffcc00',
        },
    },
};

export default Navbar;
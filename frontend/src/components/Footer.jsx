import { Link } from "react-router-dom";
import bgImg from '../assets/bgLogin.png'

export default function Footer() {
    const styles = {
        footer: {
            backgroundColor: '#dfeef6',
            color: '#4b5563',
            padding: '2rem 1rem',
            // backgroundImage: `url(${bgImg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
        },
        column: {
            flex: '1 1 calc(33.333% - 2rem)',
            minWidth: '300px',
        },
        heading: {
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            fontSize: '1.5rem'
        },
        list: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        listItem: {
            marginBottom: '0.25rem',
        },
        link: {
            textDecoration: 'none',
            color: '#1f2937',
            transition: 'color 0.2s ease',
        },
        linkHover: {
            color: '#3b82f6',
        },
        socialIcons: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1rem',
            marginRight: '7rem'
        },
        icon: {
            fontSize: '2rem',
            color: '#1f2937',
            transition: 'color 0.3s ease, transform 0.3s ease',
        },
        iconHover: {
            color: '#3b82f6',
            transform: 'scale(1.2)',
        },
        textCenter: {
            textAlign: 'center',
            marginTop: '2rem',
        },
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.column}>
                    <h3 style={styles.heading}>About QAirline</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <Link to="/ourcompany" style={styles.link}>
                                Company Profile
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/flightteam" style={styles.link}>
                                Flight Team
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/Partners" style={styles.link}>
                                Partners
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/jobs" style={styles.link}>
                                Jobs with QAirlines
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={styles.column}>
                    <h3 style={styles.heading}>Quick Links</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <Link to="/about" style={styles.link}>
                                About Us
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/contact" style={styles.link}>
                                Contact
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/terms" style={styles.link}>
                                Terms of Service
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/privacy" style={styles.link}>
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={styles.column}>
                    <h3 style={styles.heading}>Connect With Us</h3>
                    <div style={styles.socialIcons}>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.icon}
                            onMouseOver={(e) => (e.currentTarget.style.color = styles.iconHover.color)}
                            onMouseOut={(e) => (e.currentTarget.style.color = styles.icon.color)}
                        >
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.icon}
                            onMouseOver={(e) => (e.currentTarget.style.color = styles.iconHover.color)}
                            onMouseOut={(e) => (e.currentTarget.style.color = styles.icon.color)}
                        >
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.icon}
                            onMouseOver={(e) => (e.currentTarget.style.color = styles.iconHover.color)}
                            onMouseOut={(e) => (e.currentTarget.style.color = styles.icon.color)}
                        >
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                        <a
                            href="https://www.tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.icon}
                            onMouseOver={(e) => (e.currentTarget.style.color = styles.iconHover.color)}
                            onMouseOut={(e) => (e.currentTarget.style.color = styles.icon.color)}
                        >
                            <i className="fa-brands fa-tiktok"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div style={styles.textCenter}>
                <p>&copy; {new Date().getFullYear()} QAirline. All rights reserved.</p>
            </div>
        </footer>
    );
}

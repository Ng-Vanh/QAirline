import { Link } from "react-router-dom";
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3 className={styles.heading}>About QAirline</h3>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            <Link to="/ourcompany" className={styles.link}>
                                Company Profile
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/flightteam" className={styles.link}>
                                Flight Team
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/Partners" className={styles.link}>
                                Partners
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/jobs" className={styles.link}>
                                Jobs with QAirlines
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/story" className={styles.link}>
                                Brand Story
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/faq" className={styles.link}>
                                Frequently Asked Questions
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3 className={styles.heading}>Quick Links</h3>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            <Link to="/bookings" className={styles.link}>
                                Booking and Travel
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/#" className={styles.link}>
                                Special Services
                            </Link>
                        </li>

                        <li className={styles.listItem}>
                            <Link to="/#" className={styles.link}>
                                About Us
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/contact" className={styles.link}>
                                Contact
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/terms" className={styles.link}>
                                Terms of Service
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link to="/privacy" className={styles.link}>
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3 className={styles.heading}>Connect With Us</h3>
                    <div className={styles.socialIcons}>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.icon}
                        >
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.icon}
                        >
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.icon}
                        >
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                        <a
                            href="https://www.tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.icon}
                        >
                            <i className="fa-brands fa-tiktok"></i>
                        </a>
                    </div>
                    <div className={styles.emailSection}>
                        <h3 className={styles.heading}>Need Help?</h3>
                        <form className={styles.helpForm}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={styles.emailInput}
                                    required
                                />
                                <button type="submit" className={styles.submitButton}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
            <div className={styles.textCenter}>
                <p>&copy; {new Date().getFullYear()} QAirline. All rights reserved.</p>
            </div>
        </footer>
    );
}

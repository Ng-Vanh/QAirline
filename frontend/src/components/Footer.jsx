import { Link } from "react-router-dom";


export default function Footer() {
    const styles = {
        footer: {
            backgroundColor: '#dfeef6', // bg-gray-100 
            color: '#4b5563', // text-gray-600
            padding: '2rem 1rem', // px-4 py-8
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto', // mx-auto
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem', // gap-8
        },
        column: {
            flex: '1 1 calc(33.333% - 2rem)', // md:grid-cols-3
            minWidth: '300px',
        },
        heading: {
            fontWeight: 'bold', // font-bold
            marginBottom: '0.5rem', // mb-2
        },
        list: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        listItem: {
            marginBottom: '0.25rem', // space-y-1
        },
        link: {
            textDecoration: 'none',
            color: '#1f2937', // text-gray-800
            transition: 'color 0.2s ease',
        },
        linkHover: {
            color: '#3b82f6', // hover color
        },
        textCenter: {
            textAlign: 'center', // text-center
            marginTop: '2rem', // mt-8
        },
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.column}>
                    <h3 style={styles.heading}>About QAirline</h3>
                    <p>Happy flying with QAirline. We're committed to providing you with the best travel experience.</p>
                </div>
                <div style={styles.column}>
                    <h3 style={styles.heading}>Quick Links</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <Link href="/about" style={styles.link}>
                                About Us
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link href="/contact" style={styles.link}>
                                Contact
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link href="/terms" style={styles.link}>
                                Terms of Service
                            </Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link href="/privacy" style={styles.link}>
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={styles.column}>
                    <h3 style={styles.heading}>Connect With Us</h3>
                    <p>Follow us on social media for updates and promotions.</p>
                    {/* Add social media icons here */}
                </div>
            </div>
            <div style={styles.textCenter}>
                <p>&copy; {new Date().getFullYear()} QAirline. All rights reserved.</p>
            </div>
        </footer>
    );
}

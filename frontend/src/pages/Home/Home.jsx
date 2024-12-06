import Navbar from '../../components/navbar/Navbar';
import Slideshow from '../../components/slide/Slideshow';
// import SearchBar from '../../components/search_bar/SearchBar';
import SearchBar from '../Flights/Flights';
import PopularFlights from '../../components/popular_flight/PopularFlights';
import ContentSection from '../../components/contentSession/ContentSession';
import Footer from '../../components/Footer';
import styles from './home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.mainContent}>
                <section id="home" className={styles.topSection}>
                    <Slideshow />
                    <div className={styles.searchBarStyles}>
                        <SearchBar />
                    </div>

                </section>
                <section className={styles.popular}>
                    <PopularFlights />

                </section>
                <section id="explore" className={styles.contentSection}>
                    <h2>Explore</h2>
                    <ContentSection type="Introduction" />
                </section>
                <section id="promotions" className={styles.contentSection}>
                    <h2>Promotions</h2>
                    <ContentSection type="Promotions" />
                </section>
                <section id="alerts" className={styles.contentSection}>
                    <h2>Alerts</h2>
                    <ContentSection type="Alerts" />
                </section>
                <section id="news" className={styles.contentSection}>
                    <h2>News</h2>
                    <ContentSection type="News" />
                </section>
            </main>
            <Footer></Footer>
        </div>
    );
}


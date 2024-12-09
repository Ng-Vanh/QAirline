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
            <main className={styles.mainContent}>
                <section id="home" className={styles.topSection}>
                    <Slideshow />
                    <div className={styles.searchBarContainer}>
                        <div className={styles.searchBarStyles}>
                            <SearchBar />
                        </div>
                    </div>


                </section>
                <section className={styles.popular}>
                    <PopularFlights />

                </section>
                <hr style={{ width: '50%', margin: '0 auto', border: '2px solid #4cc1e1', borderRadius: '6px', boxShadow: '0px 3px 4px #4cc1e1' }} />
                <section id="explore" className={styles.contentSection}>
                    <h2 style={{ fontSize: "32px", textAlign: "center" }}>Explore</h2>
                    <ContentSection type="Introduction" />
                </section>
                <hr style={{ width: '35%', marginLeft: '6vw', border: '1px solid #FF3333', boxShadow: '0px -3px 4px #FF3333' }} />

                <section id="promotions" className={styles.contentSection}>
                    <h2 style={{ fontSize: "32px", textAlign: "center" }}>Promotions</h2>
                    <ContentSection type="Promotions" />
                </section>
                <hr style={{ width: '30%', marginLeft: '60vw', border: '1px solid #FF3333', boxShadow: '0px 3px 4px #FF3333' }} />

                <section id="alerts" className={styles.contentSection}>
                    <h2 style={{ fontSize: "32px", textAlign: "center" }}>Alerts</h2>
                    <ContentSection type="Alerts" />
                </section>
                <hr style={{ width: '35%', marginLeft: '6vw', border: '1px solid #FF3333', boxShadow: '0px -3px 4px #FF3333' }} />

                <section id="news" className={styles.contentSection}>
                    <h2 style={{ fontSize: "32px", textAlign: "center" }}>News</h2>
                    <ContentSection type="News" />
                </section>
            </main>
        </div>
    );
}


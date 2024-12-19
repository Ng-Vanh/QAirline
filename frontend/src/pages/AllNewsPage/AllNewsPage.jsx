import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Config from '~/Config';
import styles from './AllNewsPage.module.css';

export default function AllNewsPage() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9; // Hiển thị tối đa 3 hàng x 3 cột = 9 items
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${apiBaseUrl}/api/content`);
                const data = await response.json();
                const filteredNews = data.filter((item) => item.contentType === 'News' && item.isActive);
                setNews(filteredNews);
            } catch (err) {
                setError('Failed to load news. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        scrollToTop();
        fetchNews();
    }, []);

    const handleClick = (title) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        navigate(`/detail/${slug}`);
    };

    const handleNext = () => {
        if ((currentPage + 1) * itemsPerPage < news.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const paginatedNews = news.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.allNewsContainer}>
            <h1 className={styles.title}>All News</h1>
            <div className={styles.newsGrid}>
                {paginatedNews.map((item) => (
                    <div key={item._id} className={styles.newsCard} onClick={() => handleClick(item.title)} style={{ cursor: 'pointer' }}>
                        <img src={`${apiBaseUrl}/api/files/image/${item.image}`} alt={item.title} className={styles.image} />
                        <h3 className={styles.newsTitle}>{item.title}</h3>
                        <p className={styles.newsDescription}>{item.description}</p>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePrev} disabled={currentPage === 0} className={styles.navButton}>
                    <ChevronLeft /> Previous
                </button>
                <span className={styles.pageIndicator}>
                    Page {currentPage + 1} of {Math.ceil(news.length / itemsPerPage)}
                </span>
                <button onClick={handleNext} disabled={(currentPage + 1) * itemsPerPage >= news.length} className={styles.navButton}>
                    Next <ChevronRight />
                </button>
            </div>
        </div>
    );
}

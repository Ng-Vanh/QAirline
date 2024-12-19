'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Pause, ChevronUp, ChevronDown, ChevronLeft } from 'lucide-react';
import styles from './ContentSection.module.css';
import Config from '~/Config';


export default function ContentSection({ type }) {
    const apiBaseUrl = Config.apiBaseUrl;
    const scrollContainerRef = useRef(null);
    const [content, setContent] = useState([]);
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);
    const [animationClass, setAnimationClass] = useState(styles.slideUp);

    // Update screen size state on resize
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${apiBaseUrl}/api/content`);
                const data = await response.json();
                const filteredContent = data.filter(
                    (item) => item.contentType === type && item.isActive
                );
                setContent(filteredContent);
            } catch (err) {
                setError('Failed to load content. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [type]);

    useEffect(() => {
        if (type === "News" && content.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
            }, 5000);

            return () => clearInterval(intervalRef.current);
        }
    }, [type, content]);
    const nextNewsItem = () => {
        setAnimationClass(styles.slideUp);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    };

    const prevNewsItem = () => {
        setAnimationClass(styles.slideDown);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + content.length) % content.length);
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };


    const handleScroll = (e) => {
        const container = e.target;
        setShowScrollButton(
            container.scrollLeft < container.scrollWidth - container.clientWidth
        );
    };

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }


    if (!isLoading && content.length === 0) {
        return <div className={styles.noContent}>No content available.</div>;
    }

    // Tuỳ thuộc vào type (session) để áp dụng bố cục
    let layoutContent;

    if (!isSmallScreen && type === "Introduction" && content.length >= 3) {
        // Session 1 layout
        layoutContent = (
            <div className={styles.sessionOneLayout}>
                <div className={styles.left50}>{renderCard(content[0])}</div>
                <div className={styles.right50Stack}>
                    {renderCard(content[1])}
                    {renderCard(content[2])}
                </div>
            </div>
        );
    } else if (!isSmallScreen && type === "Alerts" && content.length >= 3) {
        // Session 3 layout
        layoutContent = (
            <div className={styles.sessionThreeLayout}>
                <div className={styles.left50Stack}>
                    {renderCard(content[0])}
                    {renderCard(content[1])}
                </div>
                <div className={styles.right50}>{renderCard(content[2])}</div>
            </div>
        );
    } else if (type === "News") {
        layoutContent = (
            <div className={styles.newsCarousel}>
                {content.length > 0 && renderNewsItem(content[currentIndex], currentIndex, content.length, nextNewsItem, prevNewsItem, animationClass)}
            </div>
        );

    }
    else {
        // Default layout (Session 2 and other cases)
        layoutContent = (
            <div className={styles.scrollContainerWrapper}>
                {showScrollButton && content.length > 3 && (
                    <button className={`${styles.scrollButton} ${styles.scrollLeftButton}`} onClick={scrollLeft}>
                        <ChevronLeft />
                    </button>
                )}
                <div className={styles.scrollContainer} ref={scrollContainerRef} onScroll={handleScroll}>
                    {content.map((item) => renderCard(item))}
                </div>
                {showScrollButton && content.length > 3 && (
                    <button className={styles.scrollButton} onClick={scrollRight}>
                        <ChevronRight />
                    </button>
                )}
            </div>
        );

    }

    return <div className={styles.sectionContainer}>{layoutContent}</div>;
}

// function renderCard(item) {
//     return (
//         <div key={item._id} className={styles.card}>
//             <div className={styles.imageWrapper}>
//                 <img
//                     src={require(`../../assets/${item.image}`)}
//                     alt={item.title}
//                     className={styles.image}
//                 />
//             </div>
//             <div className={styles.content}>
//                 <h3>{item.title}</h3>
//                 <p>{item.description}</p>
//             </div>
//         </div>
//     );
// }

function renderCard(item) {
    const apiBaseUrl = Config.apiBaseUrl;
  
    return (
      <div key={item._id} className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src={`${apiBaseUrl}/api/files/image/${item.image}`} // Dynamic image URL
            alt={item.title}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    );
  }

  
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function renderNewsItem(item, currentIndex, totalItems, nextNewsItem, prevNewsItem, animationClass) {
    return (
        <div key={item._id} className={`${styles.newsItem} `}>
            <div className={styles.newsLeft}>
                <span className={styles.newsLogo}>📰</span>
                <span className={styles.newsLabel}>News</span>
            </div>
            <div className={`${styles.newsContent} ${animationClass}`}>
                <span className={styles.newsDate}>
                    {formatDateTime(item.updatedAt || item.createdAt)}
                </span>
                <a href={item.link} className={styles.newsTitle}>
                    {item.title}
                </a>
            </div>
            <div className={styles.newsCounter}>
                <ChevronLeft className={styles.navIcon} onClick={prevNewsItem} />
                <span>{currentIndex + 1}/{totalItems}</span>
                <ChevronRight className={styles.navIcon} onClick={nextNewsItem} />
            </div>
            <a href={item.link} className={styles.newsButton}>
                See more <ChevronRight />
            </a>
        </div>
    );
}

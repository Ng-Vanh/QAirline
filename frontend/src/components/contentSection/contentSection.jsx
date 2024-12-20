'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './contentSection.module.css';
import Config from '~/Config';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const [animationClass, setAnimationClass] = useState(styles.slideUp);

    const handleClick = (slug) => {
        navigate(`/detail/${slug}`);
    };
    const handleAllNews = () => {
        navigate('/all-news');
    };


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

                let filteredContent = data.filter(
                    (item) => item.contentType === type && item.isActive
                );

                // Nếu type là "News", chỉ lấy 5 news mới nhất
                if (type === "News") {
                    filteredContent = filteredContent
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp từ mới nhất đến cũ nhất
                        .slice(0, 5); // Giới hạn lấy 5 news mới nhất
                }

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

    const handleNext = () => {
        if (currentIndex + 3 < content.length) {
            setCurrentIndex((prevIndex) => prevIndex + 3);
        }
    };

    // Xử lý chuyển sang nhóm trước đó
    const handlePrev = () => {
        if (currentIndex - 3 >= 0) {
            setCurrentIndex((prevIndex) => prevIndex - 3);
        }
    };

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

    const visibleContent = content.slice(currentIndex, currentIndex + 3);

    // Tuỳ thuộc vào type (session) để áp dụng bố cục
    let layoutContent;

    // if (!isSmallScreen && type === "Introduction" && content.length >= 3) {
    //     // Session 1 layout
    //     layoutContent = (
    //         <div className={styles.sessionOneLayout}>
    //             <div className={styles.left50}>{renderCard(content[0], handleClick)}</div>
    //             <div className={styles.right50Stack}>
    //                 {renderCard(content[1], handleClick)}
    //                 {renderCard(content[2], handleClick)}
    //             </div>
    //         </div>
    //     );
    // } else if (!isSmallScreen && type === "Alerts" && content.length >= 3) {
    //     // Session 3 layout
    //     layoutContent = (
    //         <div className={styles.sessionThreeLayout}>
    //             <div className={styles.left50Stack}>
    //                 {renderCard(content[0], handleClick)}
    //                 {renderCard(content[1], handleClick)}
    //             </div>
    //             <div className={styles.right50}>{renderCard(content[2], handleClick)}</div>
    //         </div>
    //     );
    // } 
    if (!isSmallScreen && type === "Introduction" && visibleContent.length >= 1) {
        layoutContent = (
            <div className={styles.sessionOneLayout}>
                <button className={`${styles.scrollButton} ${styles.scrollLeftButton}`} onClick={handlePrev} >
                    <ChevronLeft />
                </button>
                <div className={styles.left50}>{visibleContent[0] && renderCard(visibleContent[0], handleClick)}</div>
                <div className={styles.right50Stack}>
                    {visibleContent[1] && renderCard(visibleContent[1], handleClick)}
                    {visibleContent[2] && renderCard(visibleContent[2], handleClick)}
                </div>
                <button className={styles.scrollButton} onClick={handleNext} style={{ right: '-6px' }}>
                    <ChevronRight />
                </button>
            </div>
        );
    } else if (!isSmallScreen && type === "Alerts" && visibleContent.length >= 1) {
        layoutContent = (
            <div className={styles.sessionThreeLayout}>
                <button className={`${styles.scrollButton} ${styles.scrollLeftButton}`} onClick={handlePrev} >
                    <ChevronLeft />
                </button>
                <div className={styles.left50Stack}>
                    {visibleContent[0] && renderCard(visibleContent[0], handleClick)}
                    {visibleContent[1] && renderCard(visibleContent[1], handleClick)}
                </div>
                <div className={styles.right50}>{visibleContent[2] && renderCard(visibleContent[2], handleClick)}</div>
                <button className={styles.scrollButton} onClick={handleNext} style={{ right: '-6px' }} >
                    <ChevronRight />
                </button>
            </div >
        );
    }
    else if (type === "News") {
        layoutContent = (
            <div className={styles.newsCarousel}>
                {content.length > 0 && renderNewsItem(content[currentIndex], currentIndex, content.length, nextNewsItem, prevNewsItem, animationClass, handleClick, handleAllNews)}
            </div>
        );

    }
    else {
        // Default layout (Session 2 and other cases)
        layoutContent = (
            <div className={styles.scrollContainerWrapper}>

                <button className={`${styles.scrollButton} ${styles.scrollLeftButton}`} onClick={scrollLeft} >
                    <ChevronLeft />
                </button>

                <div className={styles.scrollContainer} ref={scrollContainerRef} onScroll={handleScroll}>
                    {content.map((item) => renderCard(item, handleClick))}
                </div>
                <button className={styles.scrollButton} onClick={scrollRight} >
                    <ChevronRight />
                </button>
            </div>
        );

    }

    return <div className={styles.sectionContainer}>{layoutContent}</div>;
}


function renderCard(item, handleClick) {
    const apiBaseUrl = Config.apiBaseUrl;
    const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return (
        <div key={item._id} className={styles.card} onClick={() => handleClick(slug)} style={{ cursor: 'pointer' }}>
            <div className={styles.imageWrapper}>
                <img
                    src={`${apiBaseUrl}/api/files/image/${item.image}`}
                    alt={item.title}
                    className={styles.image}
                />
                <div className={styles.hoverLine}></div>
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

function renderNewsItem(item, currentIndex, totalItems, nextNewsItem, prevNewsItem, animationClass, handleClick, handleAllNews) {
    const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return (
        <div key={item._id} className={`${styles.newsItem} `}>
            <div className={styles.newsLeft}>
                <span className={styles.newsLogo}>📰</span>
                <span className={styles.newsLabel}>News</span>
            </div>
            <div className={`${styles.newsContent} ${animationClass}`} onClick={() => handleClick(slug)} style={{ cursor: 'pointer' }}>
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
            <button className={styles.newsButton} onClick={handleAllNews}>
                See more <ChevronRight />
            </button>
        </div>
    );
}


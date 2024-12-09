'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './ContentSection.module.css';
import API_BASE_URL from '../../pages/Admin/config';

export default function ContentSection({ type }) {
    const scrollContainerRef = useRef(null);
    const [content, setContent] = useState([]);
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/content`);
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

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
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

    // Render Skeleton khi đang loading
    if (isLoading) {
        return (
            <div className={styles.sectionContainer}>
                <div className={styles.scrollContainer}>
                    {Array(4).fill().map((_, index) => (
                        <div key={index} className={`${styles.card} ${styles.skeleton}`}>
                            <div className={`${styles.imageWrapper} ${styles.skeletonImage}`}></div>
                            <div className={styles.content}>
                                <div className={`${styles.skeletonTitle} ${styles.skeletonAnimation}`}></div>
                                <div className={`${styles.skeletonDescription} ${styles.skeletonAnimation}`}></div>
                                <div className={`${styles.skeletonDescription} ${styles.skeletonAnimation}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!isLoading && content.length === 0) {
        return <div className={styles.noContent}>No content available.</div>;
    }

    // Tuỳ thuộc vào type (session) để áp dụng bố cục
    // Session 1: 50-25/25 (3 thẻ: 1 thẻ lớn bên trái, 2 thẻ chồng bên phải)
    // Session 3: 25/25-50 (3 thẻ: 2 thẻ chồng bên trái, 1 thẻ lớn bên phải)
    // Session 2 & 4: như cũ (các thẻ chia đều)
    let layoutContent;

    if (type === "Introduction" && content.length >= 3) {
        // Session 1 layout
        layoutContent = (
            <div className={styles.sessionOneLayout}>
                <div className={styles.left50}>
                    {renderCard(content[0])}
                </div>
                <div className={styles.right50Stack}>
                    {renderCard(content[1])}
                    {renderCard(content[2])}
                </div>
            </div>
        );
    } else if (type === "Alerts" && content.length >= 3) {
        // Session 3 layout (ngược lại session 1)
        layoutContent = (
            <div className={styles.sessionThreeLayout}>
                <div className={styles.left50Stack}>
                    {renderCard(content[0])}
                    {renderCard(content[1])}
                </div>
                <div className={styles.right50}>
                    {renderCard(content[2])}
                </div>
            </div>
        );
    } else {
        // Session 2 và 4 như cũ (hiển thị ngang)
        layoutContent = (
            <div className={styles.scrollContainer} ref={scrollContainerRef} onScroll={handleScroll}>
                {content.map((item) => renderCard(item))}
                {showScrollButton && content.length > 3 && (
                    <button className={styles.scrollButton} onClick={scrollRight}>
                        <ChevronRight />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={styles.sectionContainer}>
            {layoutContent}
        </div>
    );
}

function renderCard(item) {
    return (
        <div key={item._id} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={require(`../../assets/${item.image}`)}
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

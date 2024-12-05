'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './ContentSection.module.css';
import API_BASE_URL from '../../pages/Admin/config'

export default function ContentSection({ type }) {
    const scrollContainerRef = useRef(null);
    const [content, setContent] = useState([]);
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch content from the API
        const fetchContent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/content`);
                const data = await response.json();
                // Filter content by type and only include active items
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

    if (isLoading) {
        return <div className={styles.loader}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!content || content.length === 0) {
        return <div className={styles.noContent}>No content available.</div>;
    }

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.scrollContainer} ref={scrollContainerRef} onScroll={handleScroll}>
                {content.map((item) => (
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
                ))}
            </div>
            {showScrollButton && (
                <button className={styles.scrollButton} onClick={scrollRight}>
                    <ChevronRight />
                </button>
            )}
        </div>
    );
}

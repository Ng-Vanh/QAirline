import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './DetailPage.module.css';
import Config from '~/Config';

export default function DetailPage() {
    const { slug } = useParams();
    const apiBaseUrl = Config.apiBaseUrl;
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/content`);
                const data = await response.json();

                // Tìm kiếm mục có slug khớp với slug từ URL
                const item = data.find((entry) => {
                    const entrySlug = entry.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                    return entrySlug === slug;
                });

                if (item) {
                    setContent(item);
                } else {
                    setError('Content not found.');
                }
            } catch (err) {
                setError('Failed to load content. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [slug]);

    // Hàm định dạng ngày tháng
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

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
        <div className={styles.detailContainer}>
            <div className={styles.dateContainer}>
                <span className={styles.date}>{formatDateTime(content.updatedAt || content.createdAt)}</span>
            </div>
            <h1 className={styles.title}>{content.title}</h1>
            <img src={require(`../../assets/${content.image}`)} alt={content.title} className={styles.image} />
            <p className={styles.description}>{content.description}</p>
        </div>
    );
}

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './DetailPage.module.css';
import { useNavigate } from 'react-router-dom';
import Config from '~/Config';

export default function DetailPage() {
    const { slug } = useParams();
    const apiBaseUrl = Config.apiBaseUrl;
    const [content, setContent] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setIsLoading(true);
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

                // Lấy 6 bài viết mới nhất
                const recent = data
                    .filter((entry) => entry.isActive && entry._id !== item._id)
                    .slice(0, 6);
                setRecentPosts(recent);
            } catch (err) {
                setError('Failed to load content. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        scrollToTop();
        fetchContent();
    }, [slug, apiBaseUrl]);

    const handleClick = (title) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        navigate(`/detail/${slug}`);
    };

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
        <div className={styles.detailPageContainer}>
            <div className={styles.recentPosts}>
                <p>You may like</p>
                {recentPosts.map((post) => (
                    <div key={post._id} className={styles.recentPostItem} onClick={() => handleClick(post.title)}>
                        <img src={`${apiBaseUrl}/api/files/image/${post.image}`} alt={post.title} className={styles.recentImage} />
                        <div className={styles.recentContent}>
                            <h4 className={styles.recentTitle}>{post.title}</h4>
                            <p className={styles.recentDescription}>{post.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.detailContainer}>
                <span className={styles.date}>{formatDateTime(content.updatedAt || content.createdAt)}</span>
                <h1 className={styles.title}>{content.title}</h1>
                <img src={`${apiBaseUrl}/api/files/image/${content.image}`} alt={content.title} className={styles.image} />
                <div className={styles.descriptionContainer}>
                    <p className={styles.description}>{content.description}</p>
                </div>
            </div>
        </div>
    );
}

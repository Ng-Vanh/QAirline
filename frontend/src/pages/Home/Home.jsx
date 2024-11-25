import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import bg1 from '../../assets/bg1.jpg';
import bg2 from '../../assets/bg2.jpg';
import bg3 from '../../assets/bg3.jpg';

const Home = () => {
    const slides = [
        { image: bg1, caption: 'Khám phá bầu trời với chúng tôi' },
        { image: bg2, caption: 'An toàn - Tiện lợi - Đẳng cấp' },
        { image: bg3, caption: 'Hành trình của bạn, niềm tự hào của chúng tôi' },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 3000); // Thời gian tự động chuyển slide (3 giây)

        return () => clearInterval(slideInterval);
    }, [slides.length]);

    return (
        <div>
            <Navbar />
            <div style={styles.sliderContainer}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.slide,
                            opacity: index === currentSlide ? 1 : 0, // Hiển thị slide hiện tại
                            zIndex: index === currentSlide ? 1 : 0,
                        }}
                    >
                        <img src={slide.image} alt={slide.caption} style={styles.slideImage} />
                        <div style={styles.caption}>{slide.caption}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    sliderContainer: {
        marginTop: '60px', // Để chừa khoảng trống cho Navbar
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
    },
    slide: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        transition: 'opacity 1s ease-in-out', // Hiệu ứng chuyển đổi
    },
    slideImage: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    caption: {
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        color: '#fff',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
    },
};

export default Home;
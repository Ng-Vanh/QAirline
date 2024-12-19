'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, DollarSign, TrendingUp, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import reportStyle from './stylesReports.module.css';
import Config from '~/Config';

export default function Reports() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardWidth, setCardWidth] = useState('300px');

    // Toast state
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: '' });
    const [toastOpen, setToastOpen] = useState(false);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiBaseUrl}/api/statistics`);
                setStats(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('Failed to load data. Please try again later.');
                showToast('Error', 'Failed to fetch statistics. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const showToast = (title, description, type) => {
        setToastMessage({ title, description, type });
        setToastOpen(true);
    };

    const renderCard = (title, value, icon, subtext) => (
        <div className={reportStyle.card} style={{ width: cardWidth }}>
            <div className={reportStyle.card_header}>
                <h2 className={reportStyle.card_title}>{title}</h2>
                {icon}
            </div>
            <div className={reportStyle.card_content}>{value}</div>
            <p className={reportStyle.card_subtext}>
                <TrendingUp size={14} className={reportStyle.trend_icon} />
                {subtext}
            </p>
        </div>
    );

    const handleWidthChange = (e) => {
        setCardWidth(e.target.value);
    };

    return (
        <div className={reportStyle.container}>
            <div className={reportStyle.header}>
                <h1 className={reportStyle.heading}>Booking Statistics</h1>
                {/* <div className={reportStyle.width_sorter}>
                    <label htmlFor="width-select">View: </label>
                    <select id="width-select" value={cardWidth} onChange={handleWidthChange}>
                        <option value="250px">Narrow (250px)</option>
                        <option value="300px">Medium (300px)</option>
                        <option value="350px">Wide (350px)</option>
                        <option value="100%">Full Width</option>
                    </select>
                </div> */}
            </div>
            {loading ? (
                <div className={reportStyle.loading}>
                    <Loader className={reportStyle.spinner} />
                    <p>Loading statistics...</p>
                </div>
            ) : error ? (
                <div className={reportStyle.error}>{error}</div>
            ) : stats ? (
                <div className={reportStyle.grid}>
                    {renderCard(
                        "Total Bookings",
                        stats.totalBookings.toLocaleString(),
                        <Calendar size={24} />,
                        "+20% from last month"
                    )}
                    {renderCard(
                        "Total Revenue",
                        `$${stats.totalRevenue.toLocaleString()}`,
                        <DollarSign size={24} />,
                        "+15% from last month"
                    )}
                    {renderCard(
                        "Total Users",
                        stats.totalUsers.toLocaleString(),
                        <Users size={24} />,
                        "+10% from last week"
                    )}
                </div>
            ) : null}

            <Toast.Provider>
                <Toast.Root
                    className={`${reportStyle.toast} ${toastMessage.type === 'success' ? reportStyle.success : reportStyle.error
                        }`}
                    open={toastOpen}
                    onOpenChange={setToastOpen}
                >
                    <Toast.Title className={reportStyle.toastTitle}>{toastMessage.title}</Toast.Title>
                    <Toast.Description className={reportStyle.toastDescription}>
                        {toastMessage.description}
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={reportStyle.toastViewport} />
            </Toast.Provider>
        </div>
    );
}

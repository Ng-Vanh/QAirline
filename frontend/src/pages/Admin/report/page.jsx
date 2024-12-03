


'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import API_BASE_URL from '../config';
import './stylesReports.css';

export default function Reports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/statistics`);
                setStats(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const renderCard = (title, value, icon, subtext) => (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">{title}</h2>
                {icon}
            </div>
            <div className="card-content">{value}</div>
            <p className="card-subtext">
                <TrendingUp size={14} className="trend-icon" />
                {subtext}
            </p>
        </div>
    );

    return (
        <div className="container">
            <h1 className="heading">Booking Statistics</h1>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : stats ? (
                <div className="grid">
                    {renderCard("Total Bookings", stats.totalBookings.toLocaleString(), <Calendar size={24} />, "+20% from last month")}
                    {renderCard("Total Revenue", `$${stats.totalRevenue.toLocaleString()}`, <DollarSign size={24} />, "+15% from last month")}
                    {renderCard("Total Users", stats.totalUsers.toLocaleString(), <Users size={24} />, "+10% from last week")}
                </div>
            ) : null}
        </div>
    );
}







































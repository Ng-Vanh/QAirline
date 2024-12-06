'use client';

import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import styles from './PopularFlights.module.css';
import API_BASE_URL from '~/pages/Admin/config';

export default function PopularFlights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPopularFlights() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/bookings/rank/popular-flights`);
                if (!response.ok) {
                    throw new Error('Failed to fetch flights');
                }
                const data = await response.json();
                setFlights(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPopularFlights();
    }, []);

    if (loading) {
        return <p>Loading popular flights...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section id="popular-flights" className={styles.popularFlights}>
            <h2>Popular Flights</h2>
            <div className={styles.flightList}>
                {flights.map((flight, index) => (
                    <div key={index} className={styles.flightCard}>
                        <Plane className={styles.icon} />
                        <h3>{flight.departureCity} to {flight.arrivalCity}</h3>
                        <p>{flight.flightCount} flights</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

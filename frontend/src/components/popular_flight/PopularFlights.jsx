'use client';

import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import styles from './PopularFlights.module.css';
import Config from '~/Config';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PopularFlights() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPopularFlights() {
            try {
                const response = await fetch(`${apiBaseUrl}/api/bookings/rank/popular-flights`);
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

    const handleFlightClick = (departureCity, destinationCity) => {
        const prevState = {
            searchType: 'oneWay',
            departureCity: departureCity || '',
            destinationCity: destinationCity || '',
            passengerCount: 1,
        };

        console.log("Clicked")
        navigate('/flights', {
            state: {
                from: location.pathname,
                prevState: prevState
            },
        });
    }

    return (
        <section id="popular-flights" className={styles.popularFlights}>
            <h2>Popular Flights</h2>
            {loading ? (
                <div className={styles.spinnerContainer}>
                    <div className={styles.spinner}></div>
                </div>
            ) : error ? (
                <p className={styles.error}>Error: {error}</p>
            ) : (
                <div className={styles.flightList}>
                    {flights.map((flight, index) => (
                        <div
                            key={index}
                            className={styles.flightCard}
                            onClick={() => handleFlightClick(flight.departureCity, flight.arrivalCity)}
                        >
                            <Plane className={styles.icon} />
                            <h3>{flight.departureCity} to {flight.arrivalCity}</h3>
                            <p>{flight.flightCount} flights</p>
                            <div className={styles.bookNow}>
                                <span>Book now</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

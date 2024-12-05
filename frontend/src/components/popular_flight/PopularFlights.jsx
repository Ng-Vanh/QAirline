'use client';

import { Plane } from 'lucide-react';
import styles from './PopularFlights.module.css';
import { mockPopularFlights } from '../mockData';

export default function PopularFlights() {
    return (
        <section id="popular-flights" className={styles.popularFlights}>
            <h2>Popular Flights</h2>
            <div className={styles.flightList}>
                {mockPopularFlights.map((flight, index) => (
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


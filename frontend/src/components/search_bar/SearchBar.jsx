'use client';

import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
    const [passengers, setPassengers] = useState(1);
    const navigateToSearchFlights = () => {
        window.location.href = '/flights';
    }

    return (
        <div className={styles.searchBar}>
            <div className={styles.inputGroup}>
                <input type="text" placeholder="From" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <input type="text" placeholder="To" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <input type="date" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.passengers}>
                    <Users className={styles.icon} />
                    <button onClick={() => setPassengers(prev => Math.max(1, prev - 1))}>-</button>
                    <span>{passengers}</span>
                    <button onClick={() => setPassengers(prev => prev + 1)}>+</button>
                </div>
            </div>
            <button className={styles.searchButton} onClick={navigateToSearchFlights}>
                <Search className={styles.icon} />
                Search Flights
            </button>
        </div>
    );
}


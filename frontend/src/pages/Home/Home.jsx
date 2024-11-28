import React from 'react';
import FlightSearchForm from '../../components/FlightSearchForm'

const Home = () => {

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '1rem',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.875rem', // text-3xl
            fontWeight: 'bold',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Search Flights</h1>
            {/* Flight Search Form */}
            <FlightSearchForm />
        </div>
    );
};

export default Home;

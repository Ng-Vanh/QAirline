'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, ArrowRight } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function TrackFlight({ flightNumber, departureCity, arrivalCity, departureTime, arrivalTime, status }) {
    const [progress, setProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState(status);
    const [alerts, setAlerts] = useState([]);
    const [countdown, setCountdown] = useState('');
    const [estimatedArrival, setEstimatedArrival] = useState('');

    useEffect(() => {
        const departure = new Date(departureTime).getTime();
        const arrival = new Date(arrivalTime).getTime();

        const updateFlight = () => {
            const now = new Date().getTime();
            const totalDuration = arrival - departure;
            const elapsed = now - departure;
            const newProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
            setProgress(newProgress);

            if (now < departure) {
                const timeToDeparture = departure - now;
                setCountdown(formatDuration(timeToDeparture));
            } else if (now < arrival) {
                const timeToArrival = arrival - now;
                setCountdown(formatDuration(timeToArrival));
            } else {
                setCountdown('Arrived');
            }

            const remainingTime = arrival - now;
            if (remainingTime > 0) {
                const estimatedArrivalTime = new Date(now + remainingTime);
                setEstimatedArrival(estimatedArrivalTime.toLocaleTimeString());
            } else {
                setEstimatedArrival('Arrived');
            }

            if (newProgress > 0 && newProgress < 5 && currentStatus !== 'In Air') {
                setCurrentStatus('In Air');
                setAlerts((prev) => [...prev, 'Flight has taken off']);
            }
            if (newProgress > 25 && newProgress < 30 && !alerts.includes('Flight is cruising')) {
                setAlerts((prev) => [...prev, 'Flight is cruising at cruising altitude']);
            }
            if (newProgress > 50 && newProgress < 55 && !alerts.includes('Flight is halfway')) {
                setAlerts((prev) => [...prev, 'Flight is halfway to destination']);
            }
            if (newProgress > 75 && newProgress < 80 && !alerts.includes('Flight is descending')) {
                setAlerts((prev) => [...prev, 'Flight is beginning descent']);
            }
            if (newProgress >= 100 && currentStatus !== 'Landed') {
                setCurrentStatus('Landed');
                setAlerts((prev) => [...prev, 'Flight has landed']);
            }
        };

        updateFlight();
        const timer = setInterval(updateFlight, 60000);

        return () => clearInterval(timer);
    }, [departureTime, arrivalTime, alerts, currentStatus]);

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return { color: '#1E3A8A' };
            case 'in air':
                return { color: '#16A34A' };
            case 'delayed':
                return { color: '#D97706' };
            case 'landed':
                return { color: '#6D28D9' };
            case 'cancelled':
                return { color: '#DC2626' };
            default:
                return { color: '#4B5563' };
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Flight Tracker: {flightNumber}</CardTitle>
                <CardDescription>Real-time flight information and updates</CardDescription>
            </CardHeader>
            <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <MapPin size={18} /> {departureCity}
                    </div>
                    <ArrowRight size={18} />
                    <div>
                        <MapPin size={18} /> {arrivalCity}
                    </div>
                </div>
                <Progress value={progress} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <p>Status</p>
                        <p style={getStatusColor(currentStatus)}>{currentStatus}</p>
                    </div>
                    <div>
                        <p>{progress < 100 ? (progress === 0 ? 'Time to Departure' : 'Time to Arrival') : 'Flight Duration'}</p>
                        <p>{countdown}</p>
                    </div>
                    <div>
                        <p>Departure Time</p>
                        <p>{new Date(departureTime).toLocaleTimeString()}</p>
                    </div>
                    <div>
                        <p>Estimated Arrival</p>
                        <p>{estimatedArrival}</p>
                    </div>
                </div>
                {alerts.length > 0 && (
                    <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <AlertTriangle style={{ marginRight: '0.5rem' }} size={18} />
                            Flight Alerts
                        </h3>
                        <ul>
                            {alerts.map((alert, index) => (
                                <li key={index}>{alert}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Plane, AlertTriangle, Search, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function GlobalFlightTracker() {
    const [flights, setFlights] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulating real-time updates
        const fetchFlights = () => {
            const mockFlights = [
                {
                    id: '1',
                    flightNumber: 'QA101',
                    airline: 'QAirline',
                    departureCity: 'New York',
                    arrivalCity: 'London',
                    departureTime: '2023-06-15T10:00:00Z',
                    arrivalTime: '2023-06-15T22:00:00Z',
                    status: 'In Air',
                    progress: 45,
                    aircraft: 'Boeing 787 Dreamliner',
                    capacity: 300,
                    availableSeats: 150,
                    flightDuration: '7h 00m',
                    stopover: null,
                },
                {
                    id: '2',
                    flightNumber: 'QA202',
                    airline: 'QAirline',
                    departureCity: 'Paris',
                    arrivalCity: 'Tokyo',
                    departureTime: '2023-06-16T14:30:00Z',
                    arrivalTime: '2023-06-17T09:30:00Z',
                    status: 'Scheduled',
                    progress: 0,
                    aircraft: 'Airbus A350',
                    capacity: 350,
                    availableSeats: 100,
                    flightDuration: '12h 00m',
                    stopover: 'Dubai (2h)',
                },
                {
                    id: '3',
                    flightNumber: 'QA303',
                    airline: 'QAirline',
                    departureCity: 'Dubai',
                    arrivalCity: 'Sydney',
                    departureTime: '2023-06-15T23:00:00Z',
                    arrivalTime: '2023-06-16T19:00:00Z',
                    status: 'Delayed',
                    progress: 0,
                    aircraft: 'Boeing 777',
                    capacity: 400,
                    availableSeats: 200,
                    flightDuration: '14h 00m',
                    stopover: null,
                },
                {
                    id: '4',
                    flightNumber: 'QA404',
                    airline: 'QAirline',
                    departureCity: 'Los Angeles',
                    arrivalCity: 'New York',
                    departureTime: '2023-06-15T08:00:00Z',
                    arrivalTime: '2023-06-15T16:00:00Z',
                    status: 'Landed',
                    progress: 100,
                    aircraft: 'Airbus A321',
                    capacity: 200,
                    availableSeats: 0,
                    flightDuration: '5h 00m',
                    stopover: null,
                },
            ];

            setFlights(mockFlights);
        };

        fetchFlights();
        const interval = setInterval(fetchFlights, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const filteredFlights = flights.filter(
        (flight) =>
            flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.departureCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.arrivalCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.airline.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'blue';
            case 'Delayed':
                return 'yellow';
            case 'In Air':
                return 'green';
            case 'Landed':
                return 'purple';
            case 'Cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Input
                    type="text"
                    placeholder="Search flights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <Button variant="outline" size="icon">
                    <Search size={18} />
                </Button>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Flight</TableHead>
                            <TableHead>Departure</TableHead>
                            <TableHead>Arrival</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFlights.map((flight) => (
                            <TableRow key={flight.id}>
                                <TableCell>
                                    {flight.airline} {flight.flightNumber}
                                </TableCell>
                                <TableCell>
                                    {flight.departureCity}
                                    <br />
                                    {new Date(flight.departureTime).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {flight.arrivalCity}
                                    <br />
                                    {new Date(flight.arrivalTime).toLocaleString()}
                                </TableCell>
                                <TableCell style={{ color: getStatusColor(flight.status) }}>
                                    {flight.status === 'Delayed' && <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} />}
                                    {flight.status === 'In Air' && <Plane size={16} style={{ marginRight: '0.5rem' }} />}
                                    {flight.status}
                                </TableCell>
                                <TableCell>
                                    <Progress value={flight.progress} />
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Info size={18} style={{ marginRight: '0.5rem' }} />
                                                Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Flight Details: {flight.airline} {flight.flightNumber}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Detailed information about the flight
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <h3>Departure</h3>
                                                    <p>{flight.departureCity}</p>
                                                    <p>{new Date(flight.departureTime).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <h3>Arrival</h3>
                                                    <p>{flight.arrivalCity}</p>
                                                    <p>{new Date(flight.arrivalTime).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <h3>Status</h3>
                                                    <p style={{ color: getStatusColor(flight.status) }}>{flight.status}</p>
                                                </div>
                                                <div>
                                                    <h3>Aircraft</h3>
                                                    <p>{flight.aircraft}</p>
                                                </div>
                                                <div>
                                                    <h3>Capacity</h3>
                                                    <p>{flight.capacity}</p>
                                                </div>
                                                <div>
                                                    <h3>Available Seats</h3>
                                                    <p>{flight.availableSeats}</p>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

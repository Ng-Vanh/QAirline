'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Edit, Trash2, Plus, Calendar, Search, Filter, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import flightStyle from './stylesFlights.module.css';
import moment from 'moment';
import Config from '~/Config';

export default function ManageFlights() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [newFlight, setNewFlight] = useState({
        flightCode: '',
        departureAirport: '',
        arrivalAirport: '',
        departureTime: '',
        arrivalTime: '',
        flightDuration: '',
        flightClass: {
            economy: { price: '', seatsAvailable: '' },
            business: { price: '', seatsAvailable: '' }
        },
        aircraft: '',
        flightStatus: 'Scheduled',
    });
    const [editingFlight, setEditingFlight] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Toast state
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: '' });
    const [toastOpen, setToastOpen] = useState(false);

    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        fetchFlights();
        fetchAirportsAndAircrafts();
    }, []);

    useEffect(() => {
        filterFlights();
    }, [flights, searchTerm, statusFilter]);

    const showToast = (title, description, type) => {
        setToastMessage({ title, description, type });
        setToastOpen(true);
    };

    const fetchFlights = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiBaseUrl}/api/flights`);
            setFlights(response.data);
        } catch (error) {
            console.error('Error fetching flights:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            showToast('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAirportsAndAircrafts = async () => {
        try {
            const [airportsResponse, aircraftsResponse] = await Promise.all([
                axios.get(`${apiBaseUrl}/api/airports`),
                axios.get(`${apiBaseUrl}/api/aircrafts`),
            ]);
            setAirports(airportsResponse.data.airports || []);
            setAircrafts(aircraftsResponse.data || []);
        } catch (error) {
            console.error('Error fetching airports or aircrafts:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            showToast('Error', errorMessage, 'error');
        }
    };

    const filterFlights = () => {
        const filtered = flights.filter((flight) => {
            const flightCode = flight.flightCode?.toLowerCase() || '';
            const departureCity = flight.departureAirport?.name?.toLowerCase() || '';
            const arrivalCity = flight.arrivalAirport?.name?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();

            return (
                (flightCode.includes(search) ||
                    departureCity.includes(search) ||
                    arrivalCity.includes(search)) &&
                (statusFilter === 'All' || flight.flightStatus === statusFilter)
            );
        });
        setFilteredFlights(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFlight(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFlightClassChange = (classType, field, value) => {
        setNewFlight(prev => ({
            ...prev,
            flightClass: {
                ...prev.flightClass,
                [classType]: {
                    ...prev.flightClass[classType],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const departureTimeUTC = new Date(newFlight.departureTime).toISOString();
            const arrivalTimeUTC = new Date(newFlight.arrivalTime).toISOString();

            const payload = {
                ...newFlight,
                departureTime: departureTimeUTC,
                arrivalTime: arrivalTimeUTC,
                // flightDuration: Math.floor((new Date(newFlight.arrivalTime) - new Date(newFlight.departureTime)) / 60000),
            };

            if (editingFlight) {
                await axios.put(`${apiBaseUrl}/api/flights/${editingFlight._id}`, payload);
                showToast('Success', 'Flight updated successfully.', 'success');
            } else {
                await axios.post(`${apiBaseUrl}/api/flights`, payload);
                showToast('Success', 'Flight added successfully.', 'success');
            }
            fetchFlights();
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            showToast('Error', errorMessage, 'error');
        } finally {
            setIsSaving(false);

        }
    };

    const handleEdit = (flight) => {
        setEditingFlight(flight);
        setNewFlight({
            flightCode: flight.flightCode || "",
            departureAirport: flight.departureAirport?._id || "",
            arrivalAirport: flight.arrivalAirport?._id || "",
            departureTime: flight.departureTime || "",
            arrivalTime: flight.arrivalTime || "",
            aircraft: flight.aircraft?._id || "",
            flightStatus: flight.flightStatus || "Scheduled",
            flightClass: flight.flightClass || {},
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBaseUrl}/api/flights/${id}`);
            showToast('Success', 'Flight deleted successfully.', 'success');
            fetchFlights();
        } catch (error) {
            console.error('Error deleting flight:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            showToast('Error', errorMessage, 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Scheduled": return flightStyle.status_scheduled;
            case "Delayed": return flightStyle.status_delayed;
            case "On time": return flightStyle.status_on_time;
            case "Landed": return flightStyle.status_landed;
            case "In flight": return flightStyle.status_in_flight;
            default: return flightStyle.status_default;
        }
    };

    return (
        <div className={flightStyle.flight_management_container}>
            <h1 className={flightStyle.flight_management_title}>Manage Flights</h1>

            <div className={flightStyle.filters_container}>
                <div className={flightStyle.search_container}>
                    <Search className={flightStyle.search_icon} />
                    <input
                        type="text"
                        placeholder="Search flights..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={flightStyle.search_input}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={flightStyle.status_select}
                >
                    <option value="All">All Statuses</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="On time">On time</option>
                    <option value="Landed">Landed</option>
                    <option value="In flight">In flight</option>
                </select>
                <button className={flightStyle.add_button} onClick={() => {
                    setEditingFlight(null);
                    setNewFlight({
                        flightCode: "",
                        departureAirport: "",
                        arrivalAirport: "",
                        departureTime: "",
                        arrivalTime: "",
                        aircraft: "",
                        flightStatus: "Scheduled",
                        flightClass: {
                            economy: { price: '', seatsAvailable: '' },
                            business: { price: '', seatsAvailable: '' }
                        },
                    });
                    setIsDialogOpen(true);
                }}>
                    <Plus /> Add New Flight
                </button>
            </div>

            {loading ? (
                <div className={flightStyle.loading}>
                    <Loader className={flightStyle.spinner} />
                    <p>Loading flights...</p>
                </div>
            ) : (
                <div className={flightStyle.flights_grid}>
                    {filteredFlights.map((flight) => (
                        <div key={flight._id} className={flightStyle.flight_card}>
                            <div className={flightStyle.flight_card_header}>
                                <h3 className={flightStyle.flight_title}>Flight {flight.flightCode || "Unknown"}</h3>
                                <div className={` ${flightStyle.flight_status} ${getStatusColor(flight.flightStatus)}`}>
                                    {flight.flightStatus || "Unknown"}
                                </div>
                            </div>
                            <div className={flightStyle.flight_info}>
                                <p><strong>From:</strong> {flight.departureAirport?.name || "Unknown"}</p>
                                <p><strong>To:</strong> {flight.arrivalAirport?.name || "Unknown"}</p>
                                <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).replace('am', 'AM').replace('pm', 'PM')}</p>
                                <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).replace('am', 'AM').replace('pm', 'PM')}</p>
                                <p><strong>Aircraft:</strong> {flight.aircraft?.model || "Unknown"}</p>
                            </div>
                            <div className={flightStyle.flight_actions}>
                                <button onClick={() => handleEdit(flight)} className={flightStyle.edit_button}>
                                    <Edit />
                                </button>
                                <button onClick={() => handleDelete(flight._id)} className={flightStyle.delete_button}>
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredFlights.length === 0 && (
                <div className={flightStyle.no_flights}>
                    <Calendar className={flightStyle.no_flights_icon} />
                    <p>No flights found</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}



            {isDialogOpen && (
                <div className={flightStyle.modal_overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsDialogOpen(false);
                }}>
                    <div className={flightStyle.modal}>
                        <h2>{editingFlight ? 'Edit Flight' : 'Add New Flight'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="flightCode">Flight Number</label>
                                <input
                                    id="flightCode"
                                    name="flightCode"
                                    value={newFlight.flightCode}
                                    onChange={handleInputChange}
                                    placeholder="e.g., QA101"
                                    required
                                />
                            </div>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="departureAirport">Departure Airport</label>
                                <select
                                    id="departureAirport"
                                    name="departureAirport"
                                    value={newFlight.departureAirport}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select departure airport</option>
                                    {airports.map((airport) => (
                                        <option key={airport._id} value={airport._id}>
                                            {airport.name} ({airport.city})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="arrivalAirport">Arrival Airport</label>
                                <select
                                    id="arrivalAirport"
                                    name="arrivalAirport"
                                    value={newFlight.arrivalAirport}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select arrival airport</option>
                                    {airports.map((airport) => (
                                        <option key={airport._id} value={airport._id}>
                                            {airport.name} ({airport.city})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="departureTime">Departure Time</label>
                                <input
                                    id="departureTime"
                                    name="departureTime"
                                    type="datetime-local"
                                    value={newFlight.departureTime ? moment(newFlight.departureTime).format('YYYY-MM-DDTHH:mm') : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="arrivalTime">Arrival Time</label>
                                <input
                                    id="arrivalTime"
                                    name="arrivalTime"
                                    type="datetime-local"
                                    value={newFlight.arrivalTime ? moment(newFlight.arrivalTime).format('YYYY-MM-DDTHH:mm') : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="aircraft">Aircraft</label>
                                <select
                                    id="aircraft"
                                    name="aircraft"
                                    value={newFlight.aircraft}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select aircraft</option>
                                    {aircrafts.map((aircraft) => (
                                        <option key={aircraft._id} value={aircraft._id}>
                                            {aircraft.model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={flightStyle.form_group}>
                                <label htmlFor="flightStatus">Flight Status</label>
                                <select
                                    id="flightStatus"
                                    name="flightStatus"
                                    value={newFlight.flightStatus}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Delayed">Delayed</option>
                                    <option value="On time">On time</option>
                                    <option value="Landed">Landed</option>
                                </select>
                            </div>
                            <div className={flightStyle.form_row}>
                                <div className={flightStyle.form_group}>
                                    <label htmlFor="economyPrice">Economy Price</label>
                                    <input
                                        id="economyPrice"
                                        type="number"
                                        value={newFlight.flightClass.economy.price}
                                        onChange={(e) => handleFlightClassChange('economy', 'price', e.target.value)}
                                        placeholder="e.g., 150"
                                    />
                                </div>
                                <div className={flightStyle.form_group}>
                                    <label htmlFor="economySeats">Economy Seats</label>
                                    <input
                                        id="economySeats"
                                        type="number"
                                        value={newFlight.flightClass.economy.seatsAvailable}
                                        onChange={(e) => handleFlightClassChange('economy', 'seatsAvailable', e.target.value)}
                                        placeholder="e.g., 198"
                                    />
                                </div>
                            </div>
                            <div className={flightStyle.form_row}>
                                <div className={flightStyle.form_group}>
                                    <label htmlFor="businessPrice">Business Price</label>
                                    <input
                                        id="businessPrice"
                                        type="number"
                                        value={newFlight.flightClass.business.price}
                                        onChange={(e) => handleFlightClassChange('business', 'price', e.target.value)}
                                        placeholder="e.g., 350"
                                    />
                                </div>
                                <div className={flightStyle.form_group}>
                                    <label htmlFor="businessSeats">Business Seats</label>
                                    <input
                                        id="businessSeats"
                                        type="number"
                                        value={newFlight.flightClass.business.seatsAvailable}
                                        onChange={(e) => handleFlightClassChange('business', 'seatsAvailable', e.target.value)}
                                        placeholder="e.g., 50"
                                    />
                                </div>
                            </div>
                            <div className={flightStyle.form_actions}>
                                <button type="submit" className={flightStyle.submit_button} disabled={isSaving}>
                                    {isSaving ? (
                                        <div className={flightStyle.save_button_container}>
                                            Processing
                                            <Loader className={`${flightStyle.spinner} ${flightStyle.spinner_save}`} />
                                        </div>
                                    ) : 'Save'}

                                </button>
                                <button type="button" onClick={() => setIsDialogOpen(false)} className={flightStyle.cancel_button}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Toast.Provider>
                <Toast.Root
                    className={`${flightStyle.toast} ${toastMessage.type === 'success' ? flightStyle.success : flightStyle.error
                        }`}
                    open={toastOpen}
                    onOpenChange={setToastOpen}
                >
                    <Toast.Title className={flightStyle.toastTitle}>{toastMessage.title}</Toast.Title>
                    <Toast.Description className={flightStyle.toastDescription}>
                        {toastMessage.description}
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={flightStyle.toastViewport} />
            </Toast.Provider>
        </div>
    );
}



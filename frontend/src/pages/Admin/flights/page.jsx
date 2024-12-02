'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Edit, Trash2, Plus, Calendar, Search, Filter, Bold } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Checkbox } from "../../../components/ui/checkbox";
import { toast } from "../../../hooks/use-toast";
import "./styles.css"



export default function ManageFlights() {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);


    const [newFlight, setNewFlight] = useState({
        flightNumber: '',
        departureAirport: '',
        arrivalAirport: '',
        departureTime: '',
        arrivalTime: '',
        flightDuration: '',
        flightClass: '',
        aircraft: '',
        flightStatus: 'Scheduled',
    });

    const [editingFlight, setEditingFlight] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [filteredFlights, setFilteredFlights] = useState(flights);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchFlights = async () => {
        try {
            const response = await axios.get('/api/flights');
            setFlights(response.data);
            setFilteredFlights(response.data);
        } catch (error) {
            console.error('Error fetching flights:', error);
            toast({ title: 'Error', description: 'Failed to fetch flights.', variant: 'destructive' });
        }
    };
    const fetchAirportsAndAircrafts = async () => {
        try {
            const [airportsResponse, aircraftsResponse] = await Promise.all([
                axios.get('/api/airports'), // Replace with your actual API endpoint
                axios.get('/api/aircrafts'), // Replace with your actual API endpoint
            ]);

            console.log('Airports:', airportsResponse.data);
            console.log('Aircrafts:', aircraftsResponse.data);

            setAirports(airportsResponse.data.airports || []);
            setAircrafts(aircraftsResponse.data || []);
        } catch (error) {
            console.error('Error fetching airports or aircrafts:', error.response?.data || error.message);
            toast({ title: 'Error', description: 'Failed to fetch airports or aircrafts.', variant: 'destructive' });
        }
    };


    useEffect(() => {
        fetchFlights();
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching
            await fetchAirportsAndAircrafts();
            setLoading(false); // Set loading to false after fetching
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = flights.filter((flight) => {
            const flightNumber = flight.flightNumber?.toLowerCase() || '';
            const departureCity = flight.departureCity?.toLowerCase() || '';
            const arrivalCity = flight.arrivalCity?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();

            return (
                (flightNumber.includes(search) ||
                    departureCity.includes(search) ||
                    arrivalCity.includes(search)) &&
                (statusFilter === 'All' || flight.status === statusFilter)
            );
        });
        setFilteredFlights(filtered);
    }, [flights, searchTerm, statusFilter]);


    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        if (name === "departureCity" || name === "arrivalCity") {
            try {
                const response = await axios.get(`/api/airports?city=${value}`);
                setNewFlight({ ...newFlight, [name]: response.data._id });
            } catch (error) {
                console.error("Error fetching airport:", error.message);
            }
        } else {
            setNewFlight({ ...newFlight, [name]: value });
        }
    };


    const handleStatusChange = (value) => {
        setNewFlight({ ...newFlight, status: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            departureAirport: newFlight.departureAirport, // Send ID
            arrivalAirport: newFlight.arrivalAirport, // Send ID
            departureTime: newFlight.departureTime,
            arrivalTime: newFlight.arrivalTime,
            flightDuration: Math.floor((new Date(newFlight.arrivalTime) - new Date(newFlight.departureTime)) / 60000), // in minutes
            flightClass: {
                economy: {
                    price: parseFloat(newFlight.flightClass?.economy?.price || 0),
                    seatsAvailable: parseInt(newFlight.flightClass?.economy?.seatsAvailable || 0),
                },
                business: {
                    price: parseFloat(newFlight.flightClass?.business?.price || 0),
                    seatsAvailable: parseInt(newFlight.flightClass?.business?.seatsAvailable || 0),
                },
            },
            aircraft: newFlight.aircraft || null, // Send ID
            flightStatus: newFlight.status,
        };

        try {
            if (editingFlight) {
                await axios.put(`/api/flights/${editingFlight._id}`, payload);
                toast({ title: 'Flight Updated', description: 'Flight successfully updated.' });
            } else {
                await axios.post('/api/flights', payload);
                toast({ title: 'Flight Added', description: 'Flight successfully added.' });
            }
            fetchFlights(); // Refresh the flight list
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error response:', error.response?.data || error.message);
        }
    };






    const handleEdit = (flight) => {
        setEditingFlight(flight);
        setNewFlight({
            flightNumber: flight.flightNumber || "",
            departureAirport: flight.departureAirport?._id || "", // Use ID
            arrivalAirport: flight.arrivalAirport?._id || "", // Use ID
            departureTime: flight.departureTime || "",
            arrivalTime: flight.arrivalTime || "",
            aircraft: flight.aircraft?._id || "", // Use ID
            status: flight.flightStatus || "Scheduled",
            flightClass: flight.flightClass || {},
        });
        setIsDialogOpen(true);
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/flights/${id}`);
            toast({ title: 'Success', description: 'Flight deleted successfully.' });
            fetchFlights(); // Refresh the flight list
        } catch (error) {
            console.error('Error deleting flight:', error);
            toast({ title: 'Error', description: 'Failed to delete flight.', variant: 'destructive' });
        }
    };
    useEffect(() => {
        fetchFlights(); // Fetch flights on component mount
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case "Scheduled":
                return "status-scheduled";
            case "Delayed":
                return "status-delayed";
            case "Cancelled":
                return "status-cancelled";
            case "In Air":
                return "status-in-air";
            case "Landed":
                return "status-landed";
            default:
                return "status-default";
        }
    };
    return (
        <div className="flight-management-container">
            <h1 className="flight-management-title">Manage Flights</h1>

            <div className="filters-container">
                <div className="filters-left">
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <Input
                            type="text"
                            placeholder="Search flights..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value)}
                        className="select-btn"
                    >
                        <SelectTrigger className="status-select">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="In Air">In Air</SelectItem>
                            <SelectItem value="Landed">Landed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="add-button"
                    onClick={() => {
                        setEditingFlight(null);
                        setNewFlight({
                            flightNumber: "",
                            departureCity: "",
                            arrivalCity: "",
                            departureTime: "",
                            arrivalTime: "",
                            aircraft: "",
                            status: "Scheduled",
                            gate: "",
                            terminal: "",
                        });
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus className="add-button-icon" size={18} />
                    Add New Flight
                </Button>
            </div>

            <div className="filtered-flights-container">
                {filteredFlights.map((flight) => (
                    <Card key={flight._id} className="flight-card">
                        <CardContent className="flight-card-content">
                            <div className="flight-card-header">
                                <div>
                                    <h3 className="flight-title">Flight {flight.flightCode || "Unknown"}</h3>
                                    <p className="flight-info">
                                        <strong> {flight.departureAirport?.name || "Unknown Departure"}</strong> to
                                        <strong> {flight.arrivalAirport?.name || "Unknown Arrival"}</strong>
                                    </p>
                                    <p className="flight-info">
                                        <strong> Departure:</strong> {flight.departureTime ? new Date(flight.departureTime).toLocaleString() : "N/A"}
                                    </p>
                                    <p className="flight-info">
                                        <strong> Arrival:</strong> {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : "N/A"}
                                    </p>
                                    <p className="flight-info"> <strong> Duration:</strong> {flight.flightDuration || "N/A"}</p>
                                    <p className="flight-info">
                                        <strong> Aircraft:</strong> {flight.aircraft?.model || "Unknown"}
                                    </p>
                                    <Badge className={`flight-status ${getStatusColor(flight.flightStatus || "Unknown")}`}>
                                        {flight.flightStatus || "Unknown"}
                                    </Badge>
                                </div>
                                <div className="flight-actions">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(flight)}
                                        className="flight-action-button"
                                    >
                                        <Edit size={18} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(flight._id)}
                                        className="flight-action-button"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                ))}
            </div>
            {filteredFlights.length === 0 && (
                <Card className="no-flights-card">
                    <CardContent className="no-flights-content">
                        <Calendar className="no-flights-icon" />
                        <p className="no-flights-title">No flights found</p>
                        <p className="no-flights-message">Try adjusting your search or filters.</p>
                    </CardContent>
                </Card>
            )}


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="dialog-content">
                    <form onSubmit={handleSubmit} className="dialog-form">
                        <DialogHeader className="dialog-header">
                            <DialogTitle className="dialog-title">
                                {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                            </DialogTitle>
                            <DialogDescription className="dialog-description">
                                {editingFlight
                                    ? 'Edit the details of the flight below.'
                                    : 'Fill in the details for the new flight.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="dialog-body">
                            <div className="form-group">
                                <Label htmlFor="flightNumber" className="form-label">
                                    Flight Number
                                </Label>
                                <Input
                                    id="flightNumber"
                                    name="flightNumber"
                                    value={newFlight.flightNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g., QA101"
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="departureAirport" className="form-label">
                                    Departure Airport
                                </Label>
                                <Select
                                    value={newFlight.departureAirport}
                                    onValueChange={(value) => setNewFlight({ ...newFlight, departureAirport: value })}
                                    className="form-select"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select departure airport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {airports.map((airport) => (
                                            <SelectItem key={airport._id} value={airport._id}>
                                                {airport.name} ({airport.city})
                                            </SelectItem>
                                        ))}


                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="arrivalAirport" className="form-label">
                                    Arrival Airport
                                </Label>
                                <Select
                                    value={newFlight.arrivalAirport}
                                    onValueChange={(value) => setNewFlight({ ...newFlight, arrivalAirport: value })}
                                    className="form-select"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select arrival airport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {airports.map((airport) => (
                                            <SelectItem key={airport._id} value={airport._id}>
                                                {airport.name} ({airport.city})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="departureTime" className="form-label">
                                    Departure Time
                                </Label>
                                <Input
                                    id="departureTime"
                                    name="departureTime"
                                    type="datetime-local"
                                    value={newFlight.departureTime}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="arrivalTime" className="form-label">
                                    Arrival Time
                                </Label>
                                <Input
                                    id="arrivalTime"
                                    name="arrivalTime"
                                    type="datetime-local"
                                    value={newFlight.arrivalTime}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="aircraft" className="form-label">
                                    Aircraft
                                </Label>
                                <Select
                                    value={newFlight.aircraft}
                                    onValueChange={(value) => setNewFlight({ ...newFlight, aircraft: value })}
                                    className="form-select"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select aircraft" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {aircrafts.map((aircraft) => (
                                            <SelectItem key={aircraft._id} value={aircraft._id}>
                                                {aircraft.manufacturer} {aircraft.model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="status" className="form-label">
                                    Flight Status
                                </Label>
                                <Select
                                    value={newFlight.status}
                                    onValueChange={handleStatusChange}
                                    className="form-select"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select flight status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                        <SelectItem value="Delayed">Delayed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        <SelectItem value="In Air">In Air</SelectItem>
                                        <SelectItem value="Landed">Landed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="economyPrice" className="form-label">
                                    Economy Price
                                </Label>
                                <Input
                                    id="economyPrice"
                                    name="economyPrice"
                                    type="number"
                                    value={newFlight.flightClass?.economy?.price || ""}
                                    onChange={(e) =>
                                        setNewFlight({
                                            ...newFlight,
                                            flightClass: {
                                                ...newFlight.flightClass,
                                                economy: {
                                                    ...newFlight.flightClass?.economy,
                                                    price: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    placeholder="e.g., 150"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="economySeats" className="form-label">
                                    Economy Seats Available
                                </Label>
                                <Input
                                    id="economySeats"
                                    name="economySeats"
                                    type="number"
                                    value={newFlight.flightClass?.economy?.seatsAvailable || ""}
                                    onChange={(e) =>
                                        setNewFlight({
                                            ...newFlight,
                                            flightClass: {
                                                ...newFlight.flightClass,
                                                economy: {
                                                    ...newFlight.flightClass?.economy,
                                                    seatsAvailable: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    placeholder="e.g., 198"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="businessPrice" className="form-label">
                                    Business Price
                                </Label>
                                <Input
                                    id="businessPrice"
                                    name="businessPrice"
                                    type="number"
                                    value={newFlight.flightClass?.business?.price || ""}
                                    onChange={(e) =>
                                        setNewFlight({
                                            ...newFlight,
                                            flightClass: {
                                                ...newFlight.flightClass,
                                                business: {
                                                    ...newFlight.flightClass?.business,
                                                    price: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    placeholder="e.g., 350"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="businessSeats" className="form-label">
                                    Business Seats Available
                                </Label>
                                <Input
                                    id="businessSeats"
                                    name="businessSeats"
                                    type="number"
                                    value={newFlight.flightClass?.business?.seatsAvailable || ""}
                                    onChange={(e) =>
                                        setNewFlight({
                                            ...newFlight,
                                            flightClass: {
                                                ...newFlight.flightClass,
                                                business: {
                                                    ...newFlight.flightClass?.business,
                                                    seatsAvailable: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    placeholder="e.g., 50"
                                    className="form-input"
                                />
                            </div>
                            {/* <div className="form-group">
                                <Label htmlFor="gate" className="form-label">
                                    Gate
                                </Label>
                                <Input
                                    id="gate"
                                    name="gate"
                                    value={newFlight.gate}
                                    onChange={handleInputChange}
                                    placeholder="e.g., A1"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="terminal" className="form-label">
                                    Terminal
                                </Label>
                                <Input
                                    id="terminal"
                                    name="terminal"
                                    value={newFlight.terminal}
                                    onChange={handleInputChange}
                                    placeholder="e.g., T1"
                                    className="form-input"
                                />
                            </div> */}
                        </div>

                        <DialogFooter className="dialog-footer">
                            <Button type="submit" className="form-button">
                                {editingFlight ? "Update" : "Add"} Flight
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>





        </div>


    )

}

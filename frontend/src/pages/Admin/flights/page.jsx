'use client';

import { useState, useEffect } from 'react';
import { Plane, Edit, Trash2, Plus, Calendar, Search, Filter } from 'lucide-react';
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

const flightData = [
    {
        id: 1,
        flightNumber: "UA123",
        departureCity: "San Francisco",
        arrivalCity: "New York",
        departureTime: "2023-12-01T08:00",
        arrivalTime: "2023-12-01T16:00",
        aircraft: "Boeing 737",
        status: "Scheduled",
        gate: "A12",
        terminal: "1",
    },
    {
        id: 2,
        flightNumber: "DL456",
        departureCity: "Los Angeles",
        arrivalCity: "Chicago",
        departureTime: "2023-12-01T09:00",
        arrivalTime: "2023-12-01T15:00",
        aircraft: "Airbus A320",
        status: "Delayed",
        gate: "B5",
        terminal: "2",
    },
    {
        id: 3,
        flightNumber: "AA789",
        departureCity: "Miami",
        arrivalCity: "Atlanta",
        departureTime: "2023-12-02T10:00",
        arrivalTime: "2023-12-02T12:00",
        aircraft: "Boeing 757",
        status: "Cancelled",
        gate: null,
        terminal: null,
    },
];

export default function ManageFlights() {
    const [flights, setFlights] = useState([
        { id: 1, flightNumber: 'QA101', departureCity: 'New York', arrivalCity: 'London', departureTime: '2023-06-15T10:00', arrivalTime: '2023-06-15T22:00', aircraft: 'Boeing 787', status: 'Scheduled', gate: 'A1', terminal: 'T1' },
        { id: 2, flightNumber: 'QA202', departureCity: 'Paris', arrivalCity: 'Tokyo', departureTime: '2023-06-16T14:30', arrivalTime: '2023-06-17T09:30', aircraft: 'Airbus A350', status: 'Delayed', gate: 'B3', terminal: 'T2' },
        { id: 3, flightNumber: 'QA303', departureCity: 'Dubai', arrivalCity: 'New York', departureTime: '2023-06-17T08:00', arrivalTime: '2023-06-17T14:00', aircraft: 'Boeing 777', status: 'In Air', gate: 'C2', terminal: 'T3' },
        { id: 4, flightNumber: 'QA404', departureCity: 'London', arrivalCity: 'Singapore', departureTime: '2023-06-18T22:00', arrivalTime: '2023-06-19T16:00', aircraft: 'Airbus A380', status: 'Scheduled', gate: 'D5', terminal: 'T4' },
        { id: 5, flightNumber: 'QA505', departureCity: 'Sydney', arrivalCity: 'Los Angeles', departureTime: '2023-06-19T09:00', arrivalTime: '2023-06-19T19:00', aircraft: 'Boeing 787', status: 'Scheduled', gate: 'E1', terminal: 'T2' },
    ]);

    const [newFlight, setNewFlight] = useState({
        flightNumber: '',
        departureCity: '',
        arrivalCity: '',
        departureTime: '',
        arrivalTime: '',
        aircraft: '',
        status: 'Scheduled',
        gate: '',
        terminal: '',
    });

    const [editingFlight, setEditingFlight] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [filteredFlights, setFilteredFlights] = useState(flights);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const filtered = flights.filter(
            (flight) =>
                (flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    flight.departureCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    flight.arrivalCity.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (statusFilter === "All" || flight.status === statusFilter)
        );
        setFilteredFlights(filtered);
    }, [flights, searchTerm, statusFilter]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFlight({ ...newFlight, [name]: value });
    };

    const handleStatusChange = (value) => {
        setNewFlight({ ...newFlight, status: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFlight) {
            setFlights(
                flights.map((f) =>
                    f.id === editingFlight.id ? { ...editingFlight, ...newFlight } : f
                )
            );
            setEditingFlight(null);
            toast({
                title: "Flight Updated",
                description: `Flight ${newFlight.flightNumber} has been successfully updated.`,
            });
        } else {
            setFlights([
                ...flights,
                { ...newFlight, id: flights.length + 1 },
            ]);
            toast({
                title: "Flight Added",
                description: `New flight ${newFlight.flightNumber} has been successfully added.`,
            });
        }
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
        setIsDialogOpen(false);
    };

    const handleEdit = (flight) => {
        setEditingFlight(flight);
        setNewFlight({
            flightNumber: flight.flightNumber,
            departureCity: flight.departureCity,
            arrivalCity: flight.arrivalCity,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            aircraft: flight.aircraft,
            status: flight.status,
            gate: flight.gate || "",
            terminal: flight.terminal || "",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        setFlights(flights.filter((f) => f.id !== id));
        toast({
            title: "Flight Deleted",
            description: "The flight has been successfully removed from the system.",
            variant: "destructive",
        });
    };
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
                            flightNumber: '',
                            departureCity: '',
                            arrivalCity: '',
                            departureTime: '',
                            arrivalTime: '',
                            aircraft: '',
                            status: 'Scheduled',
                            gate: '',
                            terminal: '',
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
                    <Card key={flight.id} className="flight-card">
                        <CardContent className="flight-card-content">
                            <div className="flight-card-header">
                                <div>
                                    <h3 className="flight-title">Flight {flight.flightNumber}</h3>
                                    <p className="flight-info">{flight.departureCity} to {flight.arrivalCity}</p>
                                    <p className="flight-info">
                                        Departure: {new Date(flight.departureTime).toLocaleString()}
                                    </p>
                                    <p className="flight-info">
                                        Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                                    </p>
                                    <p className="flight-info">Aircraft: {flight.aircraft}</p>
                                    <p className="flight-info">Gate: {flight.gate || 'N/A'}</p>
                                    <p className="flight-info">Terminal: {flight.terminal || 'N/A'}</p>
                                    <Badge className={`flight-status ${getStatusColor(flight.status)}`}>
                                        {flight.status}
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
                                        onClick={() => handleDelete(flight.id)}
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
                                <Label htmlFor="departureCity" className="form-label">
                                    Departure City
                                </Label>
                                <Input
                                    id="departureCity"
                                    name="departureCity"
                                    value={newFlight.departureCity}
                                    onChange={handleInputChange}
                                    placeholder="e.g., New York"
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="arrivalCity" className="form-label">
                                    Arrival City
                                </Label>
                                <Input
                                    id="arrivalCity"
                                    name="arrivalCity"
                                    value={newFlight.arrivalCity}
                                    onChange={handleInputChange}
                                    placeholder="e.g., London"
                                    required
                                    className="form-input"
                                />
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
                                <Input
                                    id="aircraft"
                                    name="aircraft"
                                    value={newFlight.aircraft}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Boeing 787"
                                    required
                                    className="form-input"
                                />
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
                            </div>
                        </div>
                        <DialogFooter className="dialog-footer">
                            <Button type="submit" className="form-button">
                                {editingFlight ? 'Update' : 'Add'} Flight
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>





        </div>


    )

}

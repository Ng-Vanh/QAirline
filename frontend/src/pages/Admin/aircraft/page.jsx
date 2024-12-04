'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plane, Edit, Trash2, Plus, X, Loader } from 'lucide-react';
import { toast } from "../../../hooks/toast";
import Toaster from "../../../hooks/Toaster";
import API_BASE_URL from '../config';
import aircraftStyle from './stylesAircraft.module.css';

export default function ManageAircraft() {
    const [aircrafts, setAircrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [newAircraft, setNewAircraft] = useState({
        code: '',
        manufacturer: '',
        model: '',
        seats: 0,
        type: 'Narrow Body',
        range: 0,
        cruiseSpeed: 0,
        engineType: '',
        inService: true,
        lastMaintenance: '',
        nextMaintenance: '',
    });
    const [editingAircraft, setEditingAircraft] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchAircrafts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/aircrafts`);
            setAircrafts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching aircrafts:', err);
            setError('Failed to fetch aircrafts.');
            setLoading(false);
            toast({
                title: 'Error',
                description: 'Failed to fetch aircrafts.',
                status: 'error',
            });
        }
    };

    useEffect(() => {
        fetchAircrafts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAircraft({
            ...newAircraft,
            [name]: ['seats', 'range', 'cruiseSpeed'].includes(name)
                ? parseInt(value, 10)
                : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAircraft) {
                await axios.put(`${API_BASE_URL}/api/aircrafts/${editingAircraft._id}`, newAircraft);
                toast({
                    title: 'Aircraft Updated',
                    description: `Aircraft ${newAircraft.code} has been updated.`,
                    status: 'success',
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/aircrafts`, newAircraft);
                toast({
                    title: 'Aircraft Added',
                    description: `Aircraft ${newAircraft.code} has been added.`,
                    status: 'success',
                });
            }
            fetchAircrafts();
            resetForm();
        } catch (err) {
            console.error('Error saving aircraft:', err);
            toast({
                title: 'Error',
                description: 'Failed to save aircraft.',
                status: 'error',
            });
        }
    };

    const resetForm = () => {
        setNewAircraft({
            code: '',
            manufacturer: '',
            model: '',
            seats: 0,
            type: 'Narrow Body',
            range: 0,
            cruiseSpeed: 0,
            engineType: '',
            inService: true,
            lastMaintenance: '',
            nextMaintenance: '',
        });
        setEditingAircraft(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (aircraft) => {
        setEditingAircraft(aircraft);
        setNewAircraft(aircraft);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error("No ID provided for deletion");
            toast({
                title: "Error",
                description: "Invalid aircraft ID.",
                status: "error",
            });
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/api/aircrafts/${id}`);
            toast({
                title: "Aircraft Deleted",
                description: "Aircraft has been removed successfully.",
                status: "success",
            });
            setAircrafts((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error("Error deleting aircraft:", err);
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to delete aircraft.",
                status: "error",
            });
        }
    };

    const handleFilter = async (type) => {
        setFilterType(type);
        if (type === 'All') {
            fetchAircrafts();
        } else {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/aircrafts/type/${type}`);
                setAircrafts(response.data);
            } catch (err) {
                console.error('Error filtering aircrafts:', err);
                toast({
                    title: 'Error',
                    description: `Failed to filter aircrafts by type: ${type}.`,
                    status: 'error',
                });
            }
        }
    };

    if (loading) return (
        <div className={aircraftStyle.loading}>
            <Loader className={aircraftStyle.spinner} />
            <p>Loading aircraft...</p>
        </div>
    );
    if (error) return <p className={aircraftStyle.error}>{error}</p>;

    return (
        <div className={aircraftStyle.aircraft_management}>
            <h1 className={aircraftStyle.page_title}>Aircraft Management</h1>

            <div className={aircraftStyle.controls}>
                <button className={aircraftStyle.add_button} onClick={() => setIsDialogOpen(true)}>
                    <Plus size={16} />
                    Add New Aircraft
                </button>
                <div className={aircraftStyle.filter_buttons}>
                    <button
                        className={`${aircraftStyle.filter_button}  ${filterType === 'All' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('All')}
                    >
                        All
                    </button>
                    <button
                        className={`${aircraftStyle.filter_button}  ${filterType === 'Narrow Body' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('Narrow Body')}
                    >
                        Narrow Body
                    </button>
                    <button
                        className={`${aircraftStyle.filter_button}  ${filterType === 'Wide Body' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('Wide Body')}
                    >
                        Wide Body
                    </button>
                    <button
                        className={`${aircraftStyle.filter_button}  ${filterType === 'Regional Jet' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('Regional Jet')}
                    >
                        Regional Jet
                    </button>
                </div>
            </div>

            <div className={aircraftStyle.aircraft_grid}>
                {aircrafts.map((aircraft) => (
                    <div key={aircraft._id} className={aircraftStyle.aircraft_card}>
                        <div className={aircraftStyle.aircraft_header}>
                            <h2>{aircraft.manufacturer} {aircraft.model}</h2>
                            <span className={`${aircraftStyle.badge} ${aircraft.inService ? aircraftStyle.in_service : aircraftStyle.out_of_service}`}>
                                {aircraft.inService ? "In Service" : "Out of Service"}
                            </span>
                        </div>
                        <p className={aircraftStyle.aircraft_code}>Code: {aircraft.code}</p>
                        <div className={aircraftStyle.aircraft_details}>
                            <p><strong>Type:</strong> {aircraft.type}</p>
                            <p><strong>Seats:</strong> {aircraft.seats}</p>
                            <p><strong>Range:</strong> {aircraft.range} km</p>
                            <p><strong>Cruise Speed:</strong> {aircraft.cruiseSpeed} km/h</p>
                            <p><strong>Engine Type:</strong> {aircraft.engineType}</p>
                            <p><strong>Last Maintenance:</strong> {aircraft.lastMaintenance}</p>
                            <p><strong>Next Maintenance:</strong> {aircraft.nextMaintenance}</p>
                        </div>
                        <div className={aircraftStyle.aircraft_actions}>
                            <button className={aircraftStyle.edit_button} onClick={() => handleEdit(aircraft)}>
                                <Edit size={16} />
                                Edit
                            </button>
                            <button className={aircraftStyle.delete_button} onClick={() => handleDelete(aircraft._id)}>
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {aircrafts.length === 0 && (
                <div className={aircraftStyle.no_aircraft}>
                    <Plane size={48} />
                    <p>No aircraft added yet</p>
                    <p>Add your first aircraft to start managing your fleet.</p>
                </div>
            )}

            {isDialogOpen && (
                <div className={aircraftStyle.modal_overlay}>
                    <div className={aircraftStyle.modal}>
                        <h2>{editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={aircraftStyle.form_grid}>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="code">Aircraft Code</label>
                                    <input
                                        id="code"
                                        name="code"
                                        value={newAircraft.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g., B787"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="manufacturer">Manufacturer</label>
                                    <input
                                        id="manufacturer"
                                        name="manufacturer"
                                        value={newAircraft.manufacturer}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Boeing"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="model">Model</label>
                                    <input
                                        id="model"
                                        name="model"
                                        value={newAircraft.model}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 787 Dreamliner"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="seats">Number of Seats</label>
                                    <input
                                        id="seats"
                                        name="seats"
                                        type="number"
                                        value={newAircraft.seats}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 330"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="type">Aircraft Type</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={newAircraft.type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Narrow Body">Narrow Body</option>
                                        <option value="Wide Body">Wide Body</option>
                                        <option value="Regional Jet">Regional Jet</option>
                                    </select>
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="range">Range (km)</label>
                                    <input
                                        id="range"
                                        name="range"
                                        type="number"
                                        value={newAircraft.range}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 14140"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="cruiseSpeed">Cruise Speed (km/h)</label>
                                    <input
                                        id="cruiseSpeed"
                                        name="cruiseSpeed"
                                        type="number"
                                        value={newAircraft.cruiseSpeed}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 903"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="engineType">Engine Type</label>
                                    <input
                                        id="engineType"
                                        name="engineType"
                                        value={newAircraft.engineType}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Turbofan"
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="inService">In Service</label>
                                    <select
                                        id="inService"
                                        name="inService"
                                        value={newAircraft.inService}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="lastMaintenance">Last Maintenance</label>
                                    <input
                                        id="lastMaintenance"
                                        name="lastMaintenance"
                                        type="date"
                                        value={newAircraft.lastMaintenance}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={aircraftStyle.form_group}>
                                    <label htmlFor="nextMaintenance">Next Maintenance</label>
                                    <input
                                        id="nextMaintenance"
                                        name="nextMaintenance"
                                        type="date"
                                        value={newAircraft.nextMaintenance}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={aircraftStyle.form_actions}>
                                <button type="submit" className={aircraftStyle.save_button}>
                                    {editingAircraft ? 'Update' : 'Add'} Aircraft
                                </button>
                                <button type="button" className={aircraftStyle.cancel_button} onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <button className={aircraftStyle.close_modal} onClick={() => setIsDialogOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
}


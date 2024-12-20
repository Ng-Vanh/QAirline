'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plane, Edit, Trash2, Plus, X, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import Config from '~/Config';
import aircraftStyle from './stylesAircraft.module.css';

export default function ManageAircraft() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [aircrafts, setAircrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [isSaving, setIsSaving] = useState(false);
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

    // Radix Toast state
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: '' });
    const [toastOpen, setToastOpen] = useState(false);

    const fetchAircrafts = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/aircrafts`);
            setAircrafts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching aircrafts:', err);
            setError('Failed to fetch aircrafts.');
            setLoading(false);
            showToast('Error', 'Failed to fetch aircrafts.', 'error');
        }
    };

    useEffect(() => {
        fetchAircrafts();
    }, []);

    const showToast = (title, description, type) => {
        setToastMessage({ title, description, type });
        setToastOpen(true);
    };

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
        setIsSaving(true);
        try {
            if (editingAircraft) {
                await axios.put(`${apiBaseUrl}/api/aircrafts/${editingAircraft._id}`, newAircraft);
                showToast('Aircraft Updated', `Aircraft ${newAircraft.code} has been updated.`, 'success');
            } else {
                await axios.post(`${apiBaseUrl}/api/aircrafts`, newAircraft);
                showToast('Aircraft Added', `Aircraft ${newAircraft.code} has been added.`, 'success');
            }
            fetchAircrafts();
            resetForm();
        } catch (err) {
            console.error('Error saving aircraft:', err);
            showToast('Error', 'Failed to save aircraft.', 'error');
        } finally {
            setIsSaving(false);
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
        try {
            await axios.delete(`${apiBaseUrl}/api/aircrafts/${id}`);
            showToast('Aircraft Deleted', 'Aircraft has been removed successfully.', 'success');
            setAircrafts((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error('Error deleting aircraft:', err);
            showToast('Error', err.response?.data?.message || 'Failed to delete aircraft.', 'error');
        }
    };

    const handleFilter = async (type) => {
        setFilterType(type);
        if (type === 'All') {
            fetchAircrafts();
        } else {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/aircrafts/type/${type}`);
                setAircrafts(response.data);
            } catch (err) {
                console.error('Error filtering aircrafts:', err);
                showToast('Error', `Failed to filter aircrafts by type: ${type}.`, 'error');
            }
        }
    };

    // if (loading) return (
    //     <div className={aircraftStyle.loading}>
    //         <Loader className={aircraftStyle.spinner} />
    //         <p>Loading aircraft...</p>
    //     </div>
    // );
    // if (error) return <p className={aircraftStyle.error}>{error}</p>;

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
                        className={`${aircraftStyle.filter_button} ${filterType === 'All' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('All')}
                    >
                        All
                    </button>
                    <button
                        className={`${aircraftStyle.filter_button} ${filterType === 'Narrow Body' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('Narrow Body')}
                    >
                        Narrow Body
                    </button>
                    <button
                        className={`${aircraftStyle.filter_button} ${filterType === 'Wide Body' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('Wide Body')}
                    >
                        Wide Body
                    </button>
                    <button
                        className={`${aircraftStyle.filter_button} ${filterType === 'Regional Jet' ? aircraftStyle.active : ''}`}
                        onClick={() => handleFilter('Regional Jet')}
                    >
                        Regional Jet
                    </button>
                </div>
            </div>
            {loading ? (<div className={aircraftStyle.loading}>
                <Loader className={aircraftStyle.spinner} />
                <p>Loading aircraft...</p>
            </div>) : (<div className={aircraftStyle.aircraft_grid}>
                {aircrafts.map((aircraft) => (
                    <div key={aircraft._id} className={aircraftStyle.aircraft_card}>
                        <div className={aircraftStyle.aircraft_header}>
                            <h2> {aircraft.model}</h2>
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
                {aircrafts.length === 0 && (
                    <div className={aircraftStyle.no_aircraft}>
                        <Plane size={48} />
                        <p>No aircraft added yet</p>
                        <p>Add your first aircraft to start managing your fleet.</p>
                    </div>
                )}
            </div>)}


            {/* {aircrafts.length === 0 && (
                <div className={aircraftStyle.no_aircraft}>
                    <Plane size={48} />
                    <p>No aircraft added yet</p>
                    <p>Add your first aircraft to start managing your fleet.</p>
                </div>
            )} */}


            {isDialogOpen && (
                <div className={aircraftStyle.modal_overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsDialogOpen(false);
                }}>
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
                                <button type="submit" className={aircraftStyle.save_button} disabled={isSaving}>

                                    {isSaving ? (
                                        <div className={aircraftStyle.save_button_container}>
                                            Processing
                                            <Loader className={`${aircraftStyle.spinner} ${aircraftStyle.spinner_save}`} />
                                        </div>
                                    ) : 'Save'}
                                </button>
                                <button type="button" className={aircraftStyle.cancel_button} onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            <Toast.Provider>
                <Toast.Root
                    className={`${aircraftStyle.toast} ${toastMessage.type === 'success' ? aircraftStyle.success : aircraftStyle.error}`}
                    open={toastOpen}
                    onOpenChange={setToastOpen}
                >
                    <Toast.Title className={aircraftStyle.toastTitle}>
                        {toastMessage.title}
                    </Toast.Title>
                    <Toast.Description className={aircraftStyle.toastDescription}>
                        {toastMessage.description}
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={aircraftStyle.toastViewport} />
            </Toast.Provider>
        </div>
    );
}




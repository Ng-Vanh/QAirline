'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Plane, X, Loader } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import styleAirport from './stylesAirport.module.css';
import Config from '~/Config';

const AdminAirportManagement = () => {
    const apiBaseUrl = Config.apiBaseUrl;
    const [airports, setAirports] = useState([]);
    const [newAirport, setNewAirport] = useState({ code: '', name: '', city: '' });
    const [editingAirport, setEditingAirport] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Toast state
    const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: '' });
    const [toastOpen, setToastOpen] = useState(false);

    const [isSaving, setIsSaving] = useState(false);


    const fetchAirports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiBaseUrl}/api/airports`);
            setAirports(response.data.airports || []);
        } catch (error) {
            console.error("Error fetching airports:", error);
            showToast("Error", "Failed to fetch airports. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const showToast = (title, description, type) => {
        setToastMessage({ title, description, type });
        setToastOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAirport({ ...newAirport, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingAirport) {
                await axios.put(`${apiBaseUrl}/api/airports/${editingAirport._id}`, newAirport);
                showToast("Airport Updated", "Airport details updated successfully.", "success");
            } else {
                await axios.post(`${apiBaseUrl}/api/airports`, newAirport);
                showToast("Airport Added", "New airport added successfully.", "success");
            }
            fetchAirports();
            setNewAirport({ code: '', name: '', city: '' });
            setEditingAirport(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving airport:", error);
            showToast("Error", "Failed to save airport details.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (airport) => {
        setEditingAirport(airport);
        setNewAirport({ code: airport.code, name: airport.name, city: airport.city });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBaseUrl}/api/airports/${id}`);
            setAirports(airports.filter(airport => airport._id !== id));
            showToast("Airport Deleted", "Airport has been removed successfully.", "success");
        } catch (error) {
            console.error("Error deleting airport:", error);
            showToast("Error", "Failed to delete airport.", "error");
        }
    };

    return (
        <div className={styleAirport.airport_management}>
            <h1 className={styleAirport.page_title}>Manage Airports</h1>
            <div className={styleAirport.controls}>
                <button
                    className={styleAirport.add_button}
                    onClick={() => {
                        setEditingAirport(null);
                        setNewAirport({ code: '', name: '', city: '' });
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus size={18} />
                    Add New Airport
                </button>
            </div>

            {loading ? (
                <div className={styleAirport.loading}>
                    <Loader size={48} className={styleAirport.spinner} />
                    <p>Loading airports...</p>
                </div>
            ) : (
                <div className={styleAirport.airport_grid}>
                    {airports.length > 0 ? (
                        airports.map((airport) => (
                            <div key={airport._id} className={styleAirport.airport_card}>
                                <div className={styleAirport.airport_header}>
                                    {/* <Plane size={24} className={styleAirport.airport_icon} /> */}
                                    <h2>{airport.name}</h2>
                                </div>
                                <p className={styleAirport.airport_city}>City: {airport.city}</p>
                                <p className={styleAirport.airport_code}>Code: {airport.code}</p>
                                <div className={styleAirport.airport_actions}>
                                    <button
                                        className={styleAirport.edit_button}
                                        onClick={() => handleEdit(airport)}
                                    >
                                        <Edit size={18} />
                                        Edit
                                    </button>
                                    <button
                                        className={styleAirport.delete_button}
                                        onClick={() => handleDelete(airport._id)}
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styleAirport.no_airports}>No airports available</p>
                    )}
                </div>
            )}

            {isDialogOpen && (
                <div className={styleAirport.modal_overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsDialogOpen(false);
                }}>
                    <div className={styleAirport.modal}>
                        <h2>{editingAirport ? "Edit Airport" : "Add New Airport"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styleAirport.form_group}>
                                <label htmlFor="code">Airport Code</label>
                                <input
                                    id="code"
                                    name="code"
                                    value={newAirport.code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styleAirport.form_group}>
                                <label htmlFor="name">Airport Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={newAirport.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styleAirport.form_group}>
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    name="city"
                                    value={newAirport.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styleAirport.form_actions}>
                                <button type="submit" className={styleAirport.save_button} disabled={isSaving}>
                                    {isSaving ? (
                                        <div className={styleAirport.save_button_container}>
                                            Processing
                                            <Loader className={`${styleAirport.spinner} ${styleAirport.spinner_save}`} />
                                        </div>
                                    ) : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    className={styleAirport.cancel_button}
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <button
                            className={styleAirport.close_modal}
                            onClick={() => setIsDialogOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}

            <Toast.Provider>
                <Toast.Root
                    className={`${styleAirport.toast} ${toastMessage.type === "success"
                        ? styleAirport.success
                        : styleAirport.error
                        }`}
                    open={toastOpen}
                    onOpenChange={setToastOpen}
                >
                    <Toast.Title className={styleAirport.toastTitle}>
                        {toastMessage.title}
                    </Toast.Title>
                    <Toast.Description className={styleAirport.toastDescription}>
                        {toastMessage.description}
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={styleAirport.toastViewport} />
            </Toast.Provider>
        </div>
    );
};

export default AdminAirportManagement;

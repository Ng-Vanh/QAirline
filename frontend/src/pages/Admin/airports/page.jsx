'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Plane, X, Loader } from 'lucide-react';
import { toast } from "../../../hooks/toast";
import Toaster from "../../../hooks/Toaster";
import API_BASE_URL from '../config';
import './stylesAirport.css';

const AdminAirportManagement = () => {
    const [airports, setAirports] = useState([]);
    const [newAirport, setNewAirport] = useState({ code: '', name: '', city: '' });
    const [editingAirport, setEditingAirport] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAirports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/airports`);
            setAirports(response.data.airports || []);
        } catch (error) {
            console.error("Error fetching airports:", error);
            toast({
                title: "Error",
                description: "Failed to fetch airports. Please try again.",
                status: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAirport({ ...newAirport, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAirport) {
                await axios.put(`${API_BASE_URL}/api/airports/${editingAirport._id}`, newAirport);
                toast({
                    title: "Airport Updated",
                    description: "Airport details updated successfully.",
                    status: "success",
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/airports`, newAirport);
                toast({
                    title: "Airport Added",
                    description: "New airport added successfully.",
                    status: "success",
                });
            }
            fetchAirports();
            setNewAirport({ code: '', name: '', city: '' });
            setEditingAirport(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving airport:", error);
            toast({
                title: "Error",
                description: "Failed to save airport details.",
                status: "error",
            });
        }
    };

    const handleEdit = (airport) => {
        setEditingAirport(airport);
        setNewAirport({ code: airport.code, name: airport.name, city: airport.city });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/airports/${id}`);
            setAirports(airports.filter(airport => airport._id !== id));
            toast({
                title: "Airport Deleted",
                description: "Airport has been removed successfully.",
                status: "success",
            });
        } catch (error) {
            console.error("Error deleting airport:", error);
            toast({
                title: "Error",
                description: "Failed to delete airport.",
                status: "error",
            });
        }
    };

    return (
        <div className="airport-management">
            <h1 className="page-title">Manage Airports</h1>
            <div className="controls">
                <button className="add-button" onClick={() => {
                    setEditingAirport(null);
                    setNewAirport({ code: '', name: '', city: '' });
                    setIsDialogOpen(true);
                }}>
                    <Plus size={18} />
                    Add New Airport
                </button>
            </div>

            {loading ? (
                <div className="loading">
                    <Loader size={48} className="spinner" />
                    <p>Loading airports...</p>
                </div>
            ) : (
                <div className="airport-grid">
                    {airports.length > 0 ? (
                        airports.map((airport) => (
                            <div key={airport._id} className="airport-card">
                                <div className="airport-header">
                                    <Plane size={24} className="airport-icon" />
                                    <h2>{airport.name}</h2>
                                </div>
                                <p className="airport-city">{airport.city}</p>
                                <p className="airport-code">Code: {airport.code}</p>
                                <div className="airport-actions">
                                    <button className="edit-button" onClick={() => handleEdit(airport)}>
                                        <Edit size={18} />
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(airport._id)}>
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-airports">No airports available</p>
                    )}
                </div>
            )}

            {isDialogOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingAirport ? "Edit Airport" : "Add New Airport"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="code">Airport Code</label>
                                <input
                                    id="code"
                                    name="code"
                                    value={newAirport.code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Airport Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={newAirport.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    name="city"
                                    value={newAirport.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    {editingAirport ? "Update Airport" : "Add Airport"}
                                </button>
                                <button type="button" className="cancel-button" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <button className="close-modal" onClick={() => setIsDialogOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default AdminAirportManagement;

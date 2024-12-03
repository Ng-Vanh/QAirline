// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Plane, Edit, Trash2, Plus, Info } from 'lucide-react';
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
// import { Textarea } from "../../../components/ui/textarea";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
// import { Badge } from "../../../components/ui/badge";
// import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
// import { toast } from "../../../hooks/toast";
// import Toaster from '~/hooks/Toaster';
// import API_BASE_URL from '../config';

// import "./styles.css"



// export default function ManageAircraft() {
//     const [aircrafts, setAircrafts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filterType, setFilterType] = useState('All');
//     const [newAircraft, setNewAircraft] = useState({
//         code: '',
//         manufacturer: '',
//         model: '',
//         seats: 0,
//         type: 'Narrow Body',
//         range: 0,
//         cruiseSpeed: 0,
//         engineType: '',
//         inService: true,
//         lastMaintenance: '',
//         nextMaintenance: '',
//     });
//     const [editingAircraft, setEditingAircraft] = useState(null);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);

//     const fetchAircrafts = async () => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/api/aircrafts`);
//             setAircrafts(response.data);
//             setLoading(false);
//         } catch (err) {
//             console.error('Error fetching aircrafts:', err);
//             setError('Failed to fetch aircrafts.');
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchAircrafts();
//     }, []);


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewAircraft({
//             ...newAircraft,
//             [name]: ['seats', 'range', 'cruiseSpeed'].includes(name)
//                 ? parseInt(value, 10)
//                 : value,
//         });
//     };

//     const handleTypeChange = (value) => {
//         setNewAircraft({ ...newAircraft, type: value });
//     };

//     const handleInServiceChange = (value) => {
//         setNewAircraft({ ...newAircraft, inService: value === 'true' });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingAircraft) {
//                 // Update existing aircraft
//                 await axios.put(`${API_BASE_URL}/api/aircrafts/${editingAircraft._id}`, newAircraft);
//                 toast({ title: 'Aircraft Updated', description: `Aircraft ${newAircraft.code} has been updated.` });
//             } else {
//                 // Add new aircraft
//                 await axios.post(`${API_BASE_URL}/api/aircrafts`, newAircraft);
//                 toast({ title: 'Aircraft Added', description: `Aircraft ${newAircraft.code} has been added.` });
//             }
//             fetchAircrafts();
//             resetForm();
//         } catch (err) {
//             console.error('Error saving aircraft:', err);
//             toast({ title: 'Error', description: 'Failed to save aircraft.', variant: 'destructive' });
//         }
//     };
//     const resetForm = () => {
//         setNewAircraft({
//             code: '',
//             manufacturer: '',
//             model: '',
//             seats: 0,
//             type: 'Narrow Body',
//             range: 0,
//             cruiseSpeed: 0,
//             engineType: '',
//             inService: true,
//             lastMaintenance: '',
//             nextMaintenance: '',
//         });
//         setEditingAircraft(null);
//         setIsDialogOpen(false);
//     };
//     const handleEdit = (aircraft) => {
//         setEditingAircraft(aircraft);
//         setNewAircraft(aircraft);
//         setIsDialogOpen(true);
//     };

//     const handleDelete = async (id) => {
//         if (!id) {
//             console.error("No ID provided for deletion");
//             toast({
//                 title: "Error",
//                 description: "Invalid aircraft ID.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         console.log("Deleting aircraft with ID:", id);
//         try {
//             const response = await axios.delete(`${API_BASE_URL}/api/aircrafts/${id}`);
//             console.log("Delete response:", response.data);

//             toast({
//                 title: "Aircraft Deleted",
//                 description: "Aircraft has been removed successfully.",
//                 variant: "destructive",
//             });

//             // Update the state to remove the deleted aircraft
//             setAircrafts((prev) => prev.filter((a) => a._id !== id));
//         } catch (err) {
//             console.error("Error deleting aircraft:", err);
//             toast({
//                 title: "Error",
//                 description: err.response?.data?.message || "Failed to delete aircraft.",
//                 variant: "destructive",
//             });
//         }
//     };




//     const handleFilter = async (type) => {
//         setFilterType(type);
//         if (type === 'All') {
//             fetchAircrafts();
//         } else {
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/api/aircrafts/type/${type}`);
//                 setAircrafts(response.data);
//             } catch (err) {
//                 console.error('Error filtering aircrafts:', err);
//                 toast({ title: 'Error', description: `Failed to filter aircrafts by type: ${type}.`, variant: 'destructive' });
//             }
//         }
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;
//     return (
//         <div className="outer-container">
//             <div className="container">
//                 <div className="button-container">
//                     <button
//                         className="add-button"
//                         onClick={() => {
//                             setEditingAircraft(null);
//                             setNewAircraft({
//                                 code: '',
//                                 manufacturer: '',
//                                 model: '',
//                                 seats: 0,
//                                 type: 'Narrow Body',
//                                 range: 0,
//                                 cruiseSpeed: 0,
//                                 engineType: '',
//                                 inService: true,
//                                 lastMaintenance: '',
//                                 nextMaintenance: '',
//                             });
//                             setIsDialogOpen(true);
//                         }}
//                     >
//                         <Plus className="button-icon" size={16} />
//                         Add New
//                     </button>
//                 </div>

//                 <div className="grid-container">
//                     {/* {aircrafts.map((a) => (
//                         <Card key={a.id} className="card">
//                             <CardHeader className="card-header">
//                                 <CardTitle className="card-title">
//                                     <span>{a.manufacturer} {a.model}</span>
//                                     <span className={`badge ${a.inService ? 'badge-default' : 'badge-secondary'}`}>
//                                         {a.inService ? "In Service" : "Out of Service"}
//                                     </span>
//                                 </CardTitle>
//                                 <CardDescription className="card-description">Code: {a.code}</CardDescription>
//                             </CardHeader>
//                             <CardContent className="card-content" style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "flex-start",
//                                 textAlign: "left",
//                                 lineHeight: "0.6", // Tăng khoảng cách dòng nếu cần (tùy chỉnh)
//                             }} >
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Type:</strong> {a.type}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Seats:</strong> {a.seats}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Range:</strong> {a.range} km</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Cruise Speed:</strong> {a.cruiseSpeed} km/h</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Engine Type:</strong> {a.engineType}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Last Maintenance:</strong> {a.lastMaintenance}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Next Maintenance:</strong> {a.nextMaintenance}</p>
//                             </CardContent>
//                             <CardFooter className="card-footer">
//                                 <button className="button" onClick={() => handleEdit(a)}>
//                                     <Edit size={16} className="button-icon" />
//                                     Edit
//                                 </button>
//                                 <button className="button destructive" onClick={() => handleDelete(a.id)}>
//                                     <Trash2 size={16} className="button-icon" />
//                                     Delete
//                                 </button>
//                             </CardFooter>
//                         </Card>
//                     ))} */}
//                     {aircrafts.map((a) => (
//                         <Card key={a._id} className="card">
//                             <CardHeader className="card-header">
//                                 <CardTitle className="card-title">
//                                     <span>{a.manufacturer} {a.model}</span>
//                                     <span className={`badge ${a.inService ? 'badge-default' : 'badge-secondary'}`}>
//                                         {a.inService ? "In Service" : "Out of Service"}
//                                     </span>
//                                 </CardTitle>
//                                 <CardDescription className="card-description">Code: {a.code}</CardDescription>
//                             </CardHeader>
//                             <CardContent
//                                 className="card-content"
//                                 style={{
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     alignItems: "flex-start",
//                                     textAlign: "left",
//                                     lineHeight: "1.5",
//                                 }}
//                             >
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Type:</strong> {a.type}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Seats:</strong> {a.seats}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Range:</strong> {a.range} km</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Cruise Speed:</strong> {a.cruiseSpeed} km/h</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Engine Type:</strong> {a.engineType}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Last Maintenance:</strong> {a.lastMaintenance}</p>
//                                 <p style={{ fontSize: "18px", marginLeft: "12px" }}><strong>Next Maintenance:</strong> {a.nextMaintenance}</p>
//                             </CardContent>
//                             <CardFooter className="card-footer">
//                                 <button className="button" onClick={() => handleEdit(a)}>
//                                     <Edit size={16} className="button-icon" />
//                                     Edit
//                                 </button>
//                                 <button className="button destructive" onClick={() => handleDelete(a._id)}>
//                                     <Trash2 size={16} className="button-icon" />
//                                     Delete
//                                 </button>
//                             </CardFooter>
//                         </Card>
//                     ))}

//                 </div>
//                 {aircrafts.length === 0 && (
//                     <Card
//                         style={{
//                             border: '1px solid #e5e7eb',
//                             borderRadius: '0.5rem',
//                             backgroundColor: '#fff',
//                             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             padding: '1rem',
//                             height: '16rem', // Matches h-64 from Tailwind
//                         }}
//                     >
//                         <CardContent
//                             style={{
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 height: '100%',
//                                 textAlign: 'center',
//                             }}
//                         >
//                             <Plane
//                                 style={{
//                                     height: '4rem', // Matches h-16 from Tailwind
//                                     width: '4rem', // Matches w-16 from Tailwind
//                                     color: '#9ca3af', // Matches text-gray-400
//                                     marginBottom: '1rem', // Matches mb-4
//                                 }}
//                             />
//                             <p
//                                 style={{
//                                     fontSize: '1.25rem', // Matches text-xl
//                                     fontWeight: '600', // Matches font-semibold
//                                     color: '#4b5563', // Matches text-gray-600
//                                     marginBottom: '0.5rem',
//                                 }}
//                             >
//                                 No aircraft added yet
//                             </p>
//                             <p
//                                 style={{
//                                     fontSize: '1rem', // Matches default text size
//                                     color: '#6b7280', // Matches text-gray-500
//                                 }}
//                             >
//                                 Add your first aircraft to start managing your fleet.
//                             </p>
//                         </CardContent>
//                     </Card>
//                 )}
//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                     <DialogContent className="dialog-content">
//                         <form onSubmit={handleSubmit}>
//                             <DialogHeader>
//                                 <DialogTitle className="dialog-title">
//                                     {editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}
//                                 </DialogTitle>
//                                 <DialogDescription className="dialog-description">
//                                     {editingAircraft
//                                         ? 'Edit the details of the aircraft below.'
//                                         : 'Fill in the details for the new aircraft.'}
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <div className="form-grid">
//                                 <div className="form-group">
//                                     <Label htmlFor="code">Aircraft Code</Label>
//                                     <Input
//                                         id="code"
//                                         name="code"
//                                         value={newAircraft.code}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., B787"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="manufacturer">Manufacturer</Label>
//                                     <Input
//                                         id="manufacturer"
//                                         name="manufacturer"
//                                         value={newAircraft.manufacturer}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., Boeing"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="model">Model</Label>
//                                     <Input
//                                         id="model"
//                                         name="model"
//                                         value={newAircraft.model}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., 787 Dreamliner"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="seats">Number of Seats</Label>
//                                     <Input
//                                         id="seats"
//                                         name="seats"
//                                         type="number"
//                                         value={newAircraft.seats}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., 330"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="type">Aircraft Type</Label>
//                                     <Select value={newAircraft.type} onValueChange={handleTypeChange}>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select aircraft type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="Narrow Body">Narrow Body</SelectItem>
//                                             <SelectItem value="Wide Body">Wide Body</SelectItem>
//                                             <SelectItem value="Regional Jet">Regional Jet</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="range">Range (km)</Label>
//                                     <Input
//                                         id="range"
//                                         name="range"
//                                         type="number"
//                                         value={newAircraft.range}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., 14140"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="cruiseSpeed">Cruise Speed (km/h)</Label>
//                                     <Input
//                                         id="cruiseSpeed"
//                                         name="cruiseSpeed"
//                                         type="number"
//                                         value={newAircraft.cruiseSpeed}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., 903"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="engineType">Engine Type</Label>
//                                     <Input
//                                         id="engineType"
//                                         name="engineType"
//                                         value={newAircraft.engineType}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., Turbofan"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="inService">In Service</Label>
//                                     <Select value={newAircraft.inService.toString()} onValueChange={handleInServiceChange}>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select service status" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="true">Yes</SelectItem>
//                                             <SelectItem value="false">No</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="lastMaintenance">Last Maintenance</Label>
//                                     <Input
//                                         id="lastMaintenance"
//                                         name="lastMaintenance"
//                                         type="date"
//                                         value={newAircraft.lastMaintenance}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <Label htmlFor="nextMaintenance">Next Maintenance</Label>
//                                     <Input
//                                         id="nextMaintenance"
//                                         name="nextMaintenance"
//                                         type="date"
//                                         value={newAircraft.nextMaintenance}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                             <DialogFooter>
//                                 <Button type="submit">{editingAircraft ? 'Update' : 'Add'} Aircraft</Button>
//                             </DialogFooter>
//                         </form>
//                     </DialogContent>
//                 </Dialog>



//             </div>
//             <Toaster></Toaster>
//         </div>



//     )
// }

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plane, Edit, Trash2, Plus, X } from 'lucide-react';
import { toast } from "../../../hooks/toast";
import Toaster from "../../../hooks/Toaster";
import API_BASE_URL from '../config';
import './stylesAircraft.css';

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

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="aircraft-management">
            <h1 className="page-title">Aircraft Management</h1>

            <div className="controls">
                <button className="add-button" onClick={() => setIsDialogOpen(true)}>
                    <Plus size={16} />
                    Add New Aircraft
                </button>
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${filterType === 'All' ? 'active' : ''}`}
                        onClick={() => handleFilter('All')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-button ${filterType === 'Narrow Body' ? 'active' : ''}`}
                        onClick={() => handleFilter('Narrow Body')}
                    >
                        Narrow Body
                    </button>
                    <button
                        className={`filter-button ${filterType === 'Wide Body' ? 'active' : ''}`}
                        onClick={() => handleFilter('Wide Body')}
                    >
                        Wide Body
                    </button>
                    <button
                        className={`filter-button ${filterType === 'Regional Jet' ? 'active' : ''}`}
                        onClick={() => handleFilter('Regional Jet')}
                    >
                        Regional Jet
                    </button>
                </div>
            </div>

            <div className="aircraft-grid">
                {aircrafts.map((aircraft) => (
                    <div key={aircraft._id} className="aircraft-card">
                        <div className="aircraft-header">
                            <h2>{aircraft.manufacturer} {aircraft.model}</h2>
                            <span className={`badge ${aircraft.inService ? 'in-service' : 'out-of-service'}`}>
                                {aircraft.inService ? "In Service" : "Out of Service"}
                            </span>
                        </div>
                        <p className="aircraft-code">Code: {aircraft.code}</p>
                        <div className="aircraft-details">
                            <p><strong>Type:</strong> {aircraft.type}</p>
                            <p><strong>Seats:</strong> {aircraft.seats}</p>
                            <p><strong>Range:</strong> {aircraft.range} km</p>
                            <p><strong>Cruise Speed:</strong> {aircraft.cruiseSpeed} km/h</p>
                            <p><strong>Engine Type:</strong> {aircraft.engineType}</p>
                            <p><strong>Last Maintenance:</strong> {aircraft.lastMaintenance}</p>
                            <p><strong>Next Maintenance:</strong> {aircraft.nextMaintenance}</p>
                        </div>
                        <div className="aircraft-actions">
                            <button className="edit-button" onClick={() => handleEdit(aircraft)}>
                                <Edit size={16} />
                                Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDelete(aircraft._id)}>
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {aircrafts.length === 0 && (
                <div className="no-aircraft">
                    <Plane size={48} />
                    <p>No aircraft added yet</p>
                    <p>Add your first aircraft to start managing your fleet.</p>
                </div>
            )}

            {isDialogOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    {editingAircraft ? 'Update' : 'Add'} Aircraft
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
}

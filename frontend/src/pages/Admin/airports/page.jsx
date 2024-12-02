import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { toast } from "../../../hooks/use-toast";
import "./styles.css";

const AdminAirportManagement = () => {
    const [airports, setAirports] = useState([]);
    const [newAirport, setNewAirport] = useState({ code: '', name: '', city: '' });
    const [editingAirport, setEditingAirport] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchAirports = async () => {
        try {
            console.log("Fetching airports...");
            const response = await axios.get('/api/airports'); // Gọi API lấy danh sách sân bay
            console.log("Fetched Airports:", response.data); // Log dữ liệu nhận được
            setAirports(response.data.airports || []); // Cập nhật danh sách vào state
        } catch (error) {
            console.error("Error fetching airports:", error);
        }
    };


    // Fetch airports
    useEffect(() => {
        fetchAirports(); //
    }, []);



    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAirport({ ...newAirport, [name]: value });
    };

    // Handle submit (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAirport) {
                await axios.put(`/api/airports/${editingAirport._id}`, newAirport);
                toast({ title: "Airport Updated", description: "Airport details updated." });
            } else {
                await axios.post('/api/airports', newAirport);
                toast({ title: "Airport Added", description: "New airport added successfully." });
            }
            // Đồng bộ lại danh sách từ API
            fetchAirports();
            setNewAirport({ code: '', name: '', city: '' });
            setEditingAirport(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving airport:", error);
            toast({ title: "Error", description: "Failed to save airport details.", variant: "destructive" });
        }
    };




    // Handle Edit
    const handleEdit = (airport) => {
        setEditingAirport(airport);
        setNewAirport({ code: airport.code, name: airport.name, city: airport.city });
        setIsDialogOpen(true);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/airports/${id}`);
            setAirports(airports.filter(airport => airport._id !== id));
            toast({ title: "Airport Deleted", description: "Airport has been removed.", variant: "destructive" });
        } catch (error) {
            console.error("Error deleting airport:", error);
            toast({ title: "Error", description: "Failed to delete airport.", variant: "destructive" });
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Manage Airports</h1>
            <div className="admin-header">
                <Button className="btn-add"
                    onClick={() => {
                        setEditingAirport(null);
                        setNewAirport({ code: '', name: '', city: '' });
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus className="button-icon" size={18} />
                    Add New Airport
                </Button>
            </div>
            <div className="admin-list">
                {Array.isArray(airports) && airports.length > 0 ? (
                    airports.map((airport) => (
                        <Card key={airport._id} className="admin-card">
                            <CardHeader className="admin-card-header">
                                <CardTitle className="admin-card-title">{airport.name}</CardTitle>
                                <CardDescription className="admin-card-description">{airport.city}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Code:</strong> {airport.code}</p>
                            </CardContent>
                            <CardFooter className="admin-card-footer">
                                <Button onClick={() => handleEdit(airport)}>
                                    <Edit size={18} />
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(airport._id)}>
                                    <Trash2 size={18} />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p>No airports available</p>
                )}
            </div>



            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingAirport ? "Edit Airport" : "Add New Airport"}</DialogTitle>
                            <DialogDescription>
                                {editingAirport ? "Edit the airport details below." : "Fill in the details for the new airport."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="dialog-body">
                            <div className="form-group">
                                <Label htmlFor="code">Airport Code</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    value={newAirport.code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="name">Airport Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={newAirport.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={newAirport.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="btn-add" type="submit">{editingAirport ? "Update Airport" : "Add Airport"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminAirportManagement;

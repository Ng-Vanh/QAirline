'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Edit, Trash2, Search } from 'lucide-react';
import './styles.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'Customer',
        status: 'Active',
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Filtered users
    const filteredUsers = users.filter((user) => {
        const name = user.name?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return name.includes(search) || email.includes(search);
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update user
                await axios.put(`/api/users/${editingUser._id}`, newUser);
                setUsers((prevUsers) =>
                    prevUsers.map((u) => (u._id === editingUser._id ? { ...u, ...newUser } : u))
                );
            } else {
                // Add new user
                const response = await axios.post('/api/users', newUser);
                setUsers((prevUsers) => [...prevUsers, response.data]); // Cập nhật danh sách
            }
            resetForm();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const resetForm = () => {
        setIsDialogOpen(false);
        setNewUser({ name: '', email: '', username: '', password: '', role: 'Customer', status: 'Active' });
        setEditingUser(null);
    };


    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser({ ...user });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`);
            setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="header">User Management</h1>
            <div className="search-container">
                <Search
                    style={{
                        position: 'absolute',
                        left: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#888',
                    }}
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="button">
                Add New User
            </Button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>
                                    <Edit />
                                </button>
                                <button onClick={() => handleDelete(user._id)}>
                                    <Trash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog className="dialog-container" open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="dialog-content">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                        </DialogHeader>
                        <div className="form-group">
                            <Label htmlFor="name" className="form-label">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="email" className="form-label">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="username" className="form-label">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={newUser.username}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="password" className="form-label">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="role" className="form-label">Role</Label>
                            <select
                                id="role"
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="Customer">Customer</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <Label htmlFor="status" className="form-label">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={newUser.status}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <DialogFooter className="dialog-footer">
                            <Button type="submit" className="button">
                                Save
                            </Button>
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                className="button"
                                style={{ backgroundColor: '#dc3545' }}
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

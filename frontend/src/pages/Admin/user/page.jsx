'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from "../../../hooks/use-toast";

import './styles.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        username: '',
        password: '',
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

    const filteredUsers = users.filter((user) => {
        const name = user.name ? user.name.toLowerCase() : ''; // Default to an empty string if undefined
        const username = user.username ? user.username.toLowerCase() : ''; // Default to an empty string if undefined
        const search = searchTerm.toLowerCase();

        return name.includes(search) || username.includes(search);
    });


    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Payload sent to API:', newUser);

        try {
            const response = await axios.post('https://qairline-t28f.onrender.com/api/users/', {
                name: newUser.name,
                username: newUser.username,
                password: newUser.password
            });
            setUsers([...users, response.data.user]);
            resetForm();
            toast({
                title: 'Success',
                description: 'User created successfully!',
                status: 'success',
            });
        } catch (error) {
            console.error('Error response:', error.response?.data || error.message);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create user. Please check your input.',
                status: 'error',
            });
        }
    };




    const resetForm = () => {
        setNewUser({ name: '', username: '', password: '' });
        setIsDialogOpen(false);
    };


    // Handle user editing
    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser({ ...user });
        setIsDialogOpen(true);
    };

    // Handle user deletion
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
            <Button onClick={() => {
                resetForm();
                setIsDialogOpen(true);
            }} className="button">
                Add New User
            </Button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
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

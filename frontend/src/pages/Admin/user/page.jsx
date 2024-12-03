
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Search, UserPlus, Users } from 'lucide-react';
import { toast } from "../../../hooks/toast";
import Toaster from "../../../hooks/Toaster"
import API_BASE_URL from '../config';
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

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch users. Please try again.',
                status: 'error',
            });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const name = user.name?.toLowerCase() || '';
        const username = user.username?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || username.includes(search);
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const response = await axios.put(`${API_BASE_URL}/api/users/${newUser._id}`, newUser);
                setUsers(users.map(user => user._id === newUser._id ? response.data.user : user));
                toast({
                    title: 'Success',
                    description: 'User updated successfully!',
                    status: 'success',
                });
            } else {
                const response = await axios.post(`${API_BASE_URL}/api/users/`, newUser);
                setUsers([...users, response.data.user]);
                toast({
                    title: 'Success',
                    description: 'User created successfully!',
                    status: 'success',
                });
            }
            resetForm();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to process request. Please check your input.',
                status: 'error',
            });
        }
    };

    const resetForm = () => {
        setNewUser({ name: '', username: '', password: '' });
        setEditingUser(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser({ ...user });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/${id}`);
            setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
            toast({
                title: 'Success',
                description: 'User deleted successfully!',
                status: 'success',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete user. Please try again.',
                status: 'error',
            });
        }
    };

    return (
        <div className="container">
            <h1 className="header">
                <Users className="icon" /> User Management
            </h1>
            <div className="actions">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Search className="search-icon" />
                </div>
                <button onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                }} className="add-button">
                    <UserPlus className="icon" /> Add New User
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)} className="edit-button">
                                        <Edit className="icon" />
                                    </button>
                                    <button onClick={() => handleDelete(user._id)} className="delete-button">
                                        <Trash2 className="icon" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    value={newUser.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="dialog-actions">
                                <button type="submit" className="save-button">
                                    Save
                                </button>
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
}


'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Search, UserPlus, Users, Loader } from 'lucide-react';
import * as Toast from "@radix-ui/react-toast";
import userStyle from './stylesUser.module.css';
import Config from '~/Config';

export default function UserManagement() {
    const apiBaseUrl = Config.apiBaseUrl;
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        username: '',
        password: '',
        role: 'user',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState({ title: "", description: "", status: "" });
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiBaseUrl}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast("Error", "Failed to fetch users. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showToast = (title, description, status) => {
        setToastMessage({ title, description, status });
        setIsToastOpen(true);
    };

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
        setIsSaving(true);
        try {
            if (editingUser) {
                const response = await axios.put(`${apiBaseUrl}/api/users/${newUser._id}`, newUser);
                setUsers(users.map(user => user._id === newUser._id ? response.data.user : user));
                showToast("Success", "User updated successfully!", "success");
            } else {
                const response = await axios.post(`${apiBaseUrl}/api/users/`, newUser);
                setUsers([...users, response.data.user]);
                showToast("Success", "User created successfully!", "success");
            }
            resetForm();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            showToast(
                "Error",
                error.response?.data?.message || 'Failed to process request. Please check your input.',
                "error"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setNewUser({ name: '', username: '', password: '', role: 'user' });
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
            await axios.delete(`${apiBaseUrl}/api/users/${id}`);
            setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
            showToast("Success", "User deleted successfully!", "success");
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast("Error", "Failed to delete user. Please try again.", "error");
        }
    };

    return (
        <Toast.Provider>
            <div className={userStyle.container}>
                <h1 className={userStyle.header}>
                    User Management
                </h1>
                <div className={userStyle.actions}>
                    <div className={userStyle.search_container}>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={userStyle.search_input}
                        />
                        <Search className={userStyle.search_icon} />
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsDialogOpen(true);
                        }}
                        className={userStyle.add_button}
                    >
                        <UserPlus className={userStyle.icon} /> Add New User
                    </button>
                </div>
                <div className={userStyle.table_container}>
                    {loading ? (
                        <div className={userStyle.loading}>
                            <Loader className={userStyle.spinner} />
                            <p>Loading users...</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className={userStyle.edit_button}
                                            >
                                                <Edit className={userStyle.icon} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className={userStyle.delete_button}
                                            >
                                                <Trash2 className={userStyle.icon} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {isDialogOpen && (
                    <div className={userStyle.dialog_overlay} onClick={(e) => {
                        if (e.target === e.currentTarget) setIsDialogOpen(false);
                    }}>
                        <div className={userStyle.dialog}>
                            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={userStyle.form_group}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={userStyle.form_group}>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={userStyle.form_group}>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="text"
                                        value={newUser.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={userStyle.form_group}>
                                    <label htmlFor="role">Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className={userStyle.dialog_actions}>
                                    <button type="submit" className={userStyle.save_button}>
                                        {isSaving ? (
                                            <div className={userStyle.save_button_container}>
                                                Processing
                                                <Loader className={`${userStyle.spinner} ${userStyle.spinner_save}`} />
                                            </div>
                                        ) : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className={userStyle.cancel_button}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            <Toast.Root
                className={`${userStyle.toast} ${userStyle[toastMessage.status]}`}
                open={isToastOpen}
                onOpenChange={setIsToastOpen}
            >
                <Toast.Title className={userStyle.toastTitle}>{toastMessage.title}</Toast.Title>
                <Toast.Description className={userStyle.toastDescription}>
                    {toastMessage.description}
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className={userStyle.toastViewport} />
        </Toast.Provider>
    );
}

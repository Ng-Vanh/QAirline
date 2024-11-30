'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Search } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Customer', status: 'Active' });
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = async () => {
        try {
            const response = await axios.post('/api/users', newUser);
            setUsers([...users, response.data.user]);
            setNewUser({ name: '', email: '', role: 'Customer', status: 'Active' });
            setShowAddUserForm(false);
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Failed to add user.');
        }
    };

    const handleEdit = (id) => {
        setEditingUser(id);
    };

    const handleSave = async (id) => {
        const updatedUser = users.find((user) => user._id === id);
        try {
            const response = await axios.put(`/api/users/${id}`, updatedUser);
            setUsers(users.map((user) => (user._id === id ? response.data.user : user)));
            setEditingUser(null);
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Failed to update user.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                setUsers(users.filter((user) => user._id !== id));
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>User Management</h1>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
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
                        onChange={handleSearch}
                        style={{
                            padding: '0.5rem 2rem 0.5rem 1.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '0.375rem',
                        }}
                    />
                </div>
                <button
                    onClick={() => setShowAddUserForm(true)}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45A049')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
                >
                    Add New User
                </button>
            </div>

            {showAddUserForm && (
                <div
                    style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '0.5rem',
                    }}
                >
                    <h2>Add New User</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
                    >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <select
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <button
                        onClick={handleAddUser}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            padding: '2.5rem 1rem',
                            marginRight: '0.5rem',
                            borderRadius: '0.375rem',

                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setShowAddUserForm(false)}
                        style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>
                                {editingUser === user._id ? (
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) =>
                                            setUsers(users.map((u) => (u._id === user._id ? { ...u, name: e.target.value } : u)))
                                        }
                                    />
                                ) : (
                                    user.name
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) =>
                                            setUsers(users.map((u) => (u._id === user._id ? { ...u, email: e.target.value } : u)))
                                        }
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            setUsers(users.map((u) => (u._id === user._id ? { ...u, role: e.target.value } : u)))
                                        }
                                    >
                                        <option value="Customer">Customer</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <select
                                        value={user.status}
                                        onChange={(e) =>
                                            setUsers(users.map((u) => (u._id === user._id ? { ...u, status: e.target.value } : u)))
                                        }
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                ) : (
                                    user.status
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <button onClick={() => handleSave(user._id)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(user._id)}>
                                        <Edit />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(user._id)}>
                                    <Trash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

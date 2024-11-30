'use client'

import { useState } from 'react'
import { Edit, Trash2, Search } from 'lucide-react'

export default function UserManagement() {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Customer', status: 'Inactive' },
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [editingUser, setEditingUser] = useState(null)

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (id) => {
        setEditingUser(id)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== id))
        }
    }

    const handleSave = (id, updatedUser) => {
        setUsers(users.map(user => user.id === id ? { ...user, ...updatedUser } : user))
        setEditingUser(null)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>User Management</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                            padding: '0.5rem 2.5rem 0.5rem 1.85rem',
                            border: '1px solid #ccc',
                            borderRadius: '0.375rem',
                            width: '250px',
                        }}
                    />

                </div>
                <button
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

            <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f7f7f7' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Role</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>
                                    {editingUser === user.id ? (
                                        <input
                                            type="text"
                                            defaultValue={user.name}
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    {editingUser === user.id ? (
                                        <input
                                            type="email"
                                            defaultValue={user.email}
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    {editingUser === user.id ? (
                                        <select
                                            defaultValue={user.role}
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                                        >
                                            <option value="Customer">Customer</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    {editingUser === user.id ? (
                                        <select
                                            defaultValue={user.status}
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        <span
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: user.status === 'Active' ? '#d4f4dd' : '#f8d7da',
                                                color: user.status === 'Active' ? '#2c7a3a' : '#842029',
                                            }}
                                        >
                                            {user.status}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    {editingUser === user.id ? (
                                        <button
                                            onClick={() =>
                                                handleSave(user.id, {
                                                    name: 'Updated Name',
                                                    email: 'updated@example.com',
                                                    role: 'Customer',
                                                    status: 'Active',
                                                })
                                            }
                                            style={{
                                                color: '#28a745',
                                                border: 'none',
                                                cursor: 'pointer',
                                                marginRight: '0.5rem',
                                            }}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(user.id)}
                                            style={{
                                                color: '#007bff',
                                                border: 'none',
                                                cursor: 'pointer',
                                                marginRight: '0.5rem',
                                            }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ color: '#dc3545', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

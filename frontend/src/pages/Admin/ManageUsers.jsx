import React, { useState, useEffect } from 'react';
import api from '../../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('users/');
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            // Assuming backend has an endpoint to toggle status
            // await api.post(`users/${id}/toggle_status/`);
            // For now, optimistically update UI
            setUsers(users.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u));
            alert("User status updated (Simulation)");
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    return (
        <div className="p-8 bg-black min-h-screen text-white pt-24">
            <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-[#1f1f1f] rounded-lg overflow-hidden">
                    <thead className="bg-[#333]">
                        <tr>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-[#2a2a2a]">
                                <td className="py-4 px-6">{user.email}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                                        {user.is_active ? 'Active' : 'Suspended'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => toggleStatus(user.id, user.is_active)}
                                        className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition"
                                    >
                                        {user.is_active ? 'Suspend' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;

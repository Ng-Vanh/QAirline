'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import API_BASE_URL from '../config';

export default function Reports() {
    const [stats, setStats] = useState(null); // Holds the statistics data
    const [loading, setLoading] = useState(true);

    // Fetch statistics from the API
    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/statistics`);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    // Inline styles
    const styles = {
        container: { padding: '30px' },
        heading: { fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' },
        grid: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' },
        card: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
        cardContent: { fontSize: '24px', fontWeight: 'bold' },
        cardSubtext: { fontSize: '14px', color: '#6b7280' },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Booking Statistics</h1>
            {loading ? (
                <p>Loading...</p>
            ) : stats ? (
                <div style={styles.grid}>
                    <Card style={styles.card}>
                        <CardHeader style={styles.cardHeader}>
                            <CardTitle>Total Bookings</CardTitle>
                            <Calendar size={16} />
                        </CardHeader>
                        <CardContent style={styles.cardContent}>
                            {stats.totalBookings.toLocaleString()}
                        </CardContent>
                        <p style={styles.cardSubtext}>+20% from last month</p>
                    </Card>
                    <Card style={styles.card}>
                        <CardHeader style={styles.cardHeader}>
                            <CardTitle>Total Revenue</CardTitle>
                            <DollarSign size={16} />
                        </CardHeader>
                        <CardContent style={styles.cardContent}>
                            ${stats.totalRevenue.toLocaleString()}
                        </CardContent>
                        <p style={styles.cardSubtext}>+15% from last month</p>
                    </Card>
                    <Card style={styles.card}>
                        <CardHeader style={styles.cardHeader}>
                            <CardTitle>Total Users</CardTitle>
                            <Users size={16} />
                        </CardHeader>
                        <CardContent style={styles.cardContent}>
                            {stats.totalUsers.toLocaleString()}
                        </CardContent>
                        <p style={styles.cardSubtext}>+10% from last week</p>
                    </Card>
                </div>
            ) : (
                <p>Failed to load data.</p>
            )}
        </div>
    );
}












































// 'use client';

// import React, { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
// import { Button } from '../../../components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

// // Mock data for the chart
// const data = [
//     { name: 'Jan', bookings: 4000, revenue: 240000 },
//     { name: 'Feb', bookings: 3000, revenue: 180000 },
//     { name: 'Mar', bookings: 5000, revenue: 300000 },
//     { name: 'Apr', bookings: 2780, revenue: 166800 },
//     { name: 'May', bookings: 1890, revenue: 113400 },
//     { name: 'Jun', bookings: 2390, revenue: 143400 },
//     { name: 'Jul', bookings: 3490, revenue: 209400 },
// ];

// export default function Reports() {
//     const [timeRange, setTimeRange] = useState('7d');

//     // Calculated data
//     const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);
//     const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
//     const averageBookingsPerDay = Math.round(totalBookings / data.length);

//     const styles = {
//         container: { padding: '30px' },
//         heading: { fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' },
//         grid: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' },
//         card: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
//         select: { width: '150px' }, // Added width restriction
//         cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
//         cardTitle: { fontSize: '16px', fontWeight: '600' },
//         cardContent: { fontSize: '24px', fontWeight: 'bold' },
//         cardSubtext: { fontSize: '14px', color: '#6b7280' },
//         chartContainer: { height: '400px', marginTop: '30px' },
//         buttonContainer: { display: 'flex', justifyContent: 'flex-end', marginTop: '30px' },
//     };

//     return (
//         <div style={styles.container}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//                 <h1 style={styles.heading}>Booking Statistics</h1>
//                 <Select value={timeRange} onValueChange={setTimeRange}>
//                     <SelectTrigger style={styles.select}>
//                         <SelectValue placeholder="Select time range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="7d">Last 7 days</SelectItem>
//                         <SelectItem value="30d">Last 30 days</SelectItem>
//                         <SelectItem value="90d">Last 90 days</SelectItem>
//                         <SelectItem value="1y">Last year</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>

//             <div style={styles.grid}>
//                 <Card style={styles.card}>
//                     <CardHeader style={styles.cardHeader}>
//                         <CardTitle>Total Bookings</CardTitle>
//                         <Calendar size={16} />
//                     </CardHeader>
//                     <CardContent style={styles.cardContent}>{totalBookings.toLocaleString()}</CardContent>
//                     <p style={styles.cardSubtext}>+20.1% from last month</p>
//                 </Card>
//                 <Card style={styles.card}>
//                     <CardHeader style={styles.cardHeader}>
//                         <CardTitle>Total Revenue</CardTitle>
//                         <DollarSign size={16} />
//                     </CardHeader>
//                     <CardContent style={styles.cardContent}>${totalRevenue.toLocaleString()}</CardContent>
//                     <p style={styles.cardSubtext}>+15% from last month</p>
//                 </Card>
//                 <Card style={styles.card}>
//                     <CardHeader style={styles.cardHeader}>
//                         <CardTitle>Avg. Bookings/Day</CardTitle>
//                         <TrendingUp size={16} />
//                     </CardHeader>
//                     <CardContent style={styles.cardContent}>{averageBookingsPerDay}</CardContent>
//                     <p style={styles.cardSubtext}>+7% from last week</p>
//                 </Card>
//                 <Card style={styles.card}>
//                     <CardHeader style={styles.cardHeader}>
//                         <CardTitle>Active Users</CardTitle>
//                         <Users size={16} />
//                     </CardHeader>
//                     <CardContent style={styles.cardContent}>573</CardContent>
//                     <p style={styles.cardSubtext}>+201 since last hour</p>
//                 </Card>
//             </div>

//             <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis yAxisId="left" />
//                         <YAxis yAxisId="right" orientation="right" />
//                         <Tooltip />
//                         <Legend />
//                         <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
//                         <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>

//             <div style={styles.buttonContainer}>
//                 <Button>Download Report</Button>
//             </div>
//         </div>
//     );
// }

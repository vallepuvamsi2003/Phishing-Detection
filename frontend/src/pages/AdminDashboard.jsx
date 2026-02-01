
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldAlert, Users, Target, Activity, Zap, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentThreats, setRecentThreats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, threatsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/recent-threats')
            ]);
            setStats(statsRes.data);
            setRecentThreats(threatsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity size={48} color="var(--accent)" /></motion.div>
        </div>
    );

    const chartData = stats?.daily_stats?.labels.map((label, idx) => ({
        name: label,
        scans: stats.daily_stats.data[idx]
    })) || [];

    const pieData = [
        { name: 'Phishing', value: stats?.phishing_detected || 0 },
        { name: 'Safe', value: stats?.safe_scans || 0 }
    ];

    const COLORS = ['#ef4444', '#22c55e'];

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Threat Intel <span>Center</span></h1>
                            <p style={{ color: 'var(--text-secondary)' }}>Centralized monitoring and phishing intelligence analytics</p>
                        </div>
                        <div className="badge badge-accent">Admin Access</div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Target size={24} color="var(--accent)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Scans</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats?.total_scans}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <ShieldAlert size={24} color="var(--danger)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phishing Detected</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats?.phishing_detected}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <TrendingUp size={24} color="var(--success)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Detection Rate</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats?.total_scans > 0 ? ((stats.phishing_detected / stats.total_scans) * 100).toFixed(1) : 0}%</h3>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Users size={24} color="#a855f7" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Users</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats?.active_users}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Main Chart */}
                        <div className="md:col-span-2 card" style={{ gridColumn: 'span 2', padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={20} color="var(--accent)" /> Threat Activity (Last 7 Days)
                            </h3>
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                        <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem' }}
                                            itemStyle={{ color: 'var(--accent)' }}
                                        />
                                        <Area type="monotone" dataKey="scans" stroke="var(--accent)" fillOpacity={1} fill="url(#colorScans)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Threats Table */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={20} color="var(--danger)" /> Recent Threat Logs
                            </h3>
                            <div className="history-list">
                                {recentThreats.length === 0 ? (
                                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No threats logged.</p>
                                ) : (
                                    recentThreats.map(threat => (
                                        <div key={threat.id} className="history-item" style={{ fontSize: '0.85rem' }}>
                                            <div style={{ maxWidth: '80%' }}>
                                                <p style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{threat.content}</p>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(threat.created_at).toLocaleTimeString()}</p>
                                            </div>
                                            <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.65rem' }}>BLOCK</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AdminDashboard;

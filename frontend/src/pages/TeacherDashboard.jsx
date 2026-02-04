import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PlusCircle, Users, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = ({ user }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/teacher/results', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const stats = [
        { label: 'Total Attempts', value: results.length, icon: <Users />, color: '#8b5cf6' },
        { label: 'Tests Active', value: [...new Set(results.map(r => r.test_id))].length, icon: <ClipboardCheck />, color: '#10b981' },
        { label: 'Avg. Score', value: results.length ? (results.reduce((acc, r) => acc + (r.score / r.total), 0) / results.length * 100).toFixed(1) + '%' : '0%', icon: <BarChart3 />, color: '#f59e0b' }
    ];

    return (
        <div style={{ padding: '2rem 4rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, <span className="gradient-text">{user.username}</span></h1>
                    <p style={{ color: 'var(--text-dim)' }}>Monitor your students' performance and manage tests.</p>
                </div>
                <Link to="/create-test" className="btn btn-primary">
                    <PlusCircle size={20} /> Create New Test
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: `${stat.color}22`, padding: '1rem', borderRadius: '1rem', color: stat.color }}>{stat.icon}</div>
                        <div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.8rem' }}>{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Student Submissions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Student</th>
                            <th style={{ padding: '1rem' }}>Test</th>
                            <th style={{ padding: '1rem' }}>Score</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{row.student_name}</td>
                                <td style={{ padding: '1rem' }}>{row.test_title}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ color: row.score / row.total > 0.5 ? '#10b981' : '#f43f5e', fontWeight: 600 }}>{row.score} / {row.total}</span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{new Date(row.attempted_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {!loading && results.length === 0 && <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No attempts yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherDashboard;

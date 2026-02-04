import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = ({ user }) => {
    const [tests, setTests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [testsRes, historyRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/tests', config),
                    axios.get('http://localhost:5000/api/student/history', config)
                ]);
                setTests(testsRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '2rem 4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hi, <span className="gradient-text">{user.username}</span> 👋</h1>
                <p style={{ color: 'var(--text-dim)' }}>Test your knowledge and track your progress.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                <section>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Play size={20} fill="#8b5cf6" color="#8b5cf6" /> Available Tests
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tests.map((test, i) => (
                            <motion.div key={test.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{test.title}</h4>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{test.description || 'No description provided'}</p>
                                </div>
                                <Link to={`/take-test/${test.id}`} className="btn btn-primary">Start Test</Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Trophy size={20} color="#f59e0b" /> Your History
                    </h3>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {history.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                                    <div>
                                        <h5 style={{ fontSize: '1rem' }}>{item.test_title}</h5>
                                        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(item.attempted_at).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 700, color: '#10b981' }}>{item.score}/{item.total}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{Math.round((item.score / item.total) * 100)}%</p>
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No tests attempted yet.</p>}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;

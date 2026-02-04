import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', form);
            alert('Registered! Please login.');
            navigate('/login');
        } catch (err) {
            alert('Error registering');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ width: '400px' }}>
                <h2 className="gradient-text" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input className="input-field" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                    <input type="password" className="input-field" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-dim)' }}>
                    Already have an account? <Link to="/login" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;

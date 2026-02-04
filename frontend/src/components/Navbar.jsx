import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User as UserIcon } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookOpen size={32} className="gradient-text" style={{ color: '#8b5cf6' }} />
                <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>XamPro</h2>
            </div>
            <ul className="nav-links">
                <li><Link to={user.role === 'teacher' ? '/teacher' : '/student'}>Dashboard</Link></li>
                {user.role === 'teacher' && <li><Link to="/create-test">Create Test</Link></li>}
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <UserIcon size={18} />
                    <span>{user.username}</span>
                </li>
                <li>
                    <button onClick={() => { onLogout(); navigate('/login'); }} className="btn" style={{ background: 'transparent', color: '#ef4444' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

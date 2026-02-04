import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateTest from './pages/CreateTest';
import TakeTest from './pages/TakeTest';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            {user && <Navbar user={user} onLogout={handleLogout} />}
            <div className="container">
                <Routes>
                    <Route path="/login" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} /> : <Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/teacher" element={user?.role === 'teacher' ? <TeacherDashboard user={user} /> : <Navigate to="/login" />} />
                    <Route path="/create-test" element={user?.role === 'teacher' ? <CreateTest /> : <Navigate to="/login" />} />

                    <Route path="/student" element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/login" />} />
                    <Route path="/take-test/:id" element={user?.role === 'student' ? <TakeTest /> : <Navigate to="/login" />} />

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

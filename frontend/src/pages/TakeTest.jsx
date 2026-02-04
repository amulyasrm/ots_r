import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Send, ChevronRight, ChevronLeft } from 'lucide-react';

const TakeTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/tests/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setTest(res.data);
                setTimeLeft(res.data.questions.length * 60);
            } catch (err) { console.error(err); }
        };
        fetchTest();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0 && !result) handleSubmit();
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, result]);

    const handleSelect = (opt) => {
        const newAnsws = [...answers];
        const existing = newAnsws.findIndex(a => a.questionId === test.questions[currentIdx].id);
        if (existing > -1) newAnsws[existing].answer = opt;
        else newAnsws.push({ questionId: test.questions[currentIdx].id, answer: opt });
        setAnswers(newAnsws);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/tests/${id}/submit`, { answers }, { headers: { Authorization: `Bearer ${token}` } });
            setResult(res.data);
        } catch (err) { alert('Error submitting'); }
    };

    if (!test) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (result) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass-card" style={{ textAlign: 'center', width: '400px' }}>
                <h2 className="gradient-text" style={{ fontSize: '3rem' }}>{Math.round((result.score / result.total) * 100)}%</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Scored {result.score} / {result.total}</p>
                <button onClick={() => navigate('/student')} className="btn btn-primary" style={{ width: '100%' }}>Back to Home</button>
            </motion.div>
        </div>
    );

    const q = test.questions[currentIdx];
    const selected = answers.find(a => a.questionId === q.id)?.answer;

    return (
        <div style={{ padding: '2rem 4rem', maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div><h2>{test.title}</h2><p style={{ color: 'var(--text-dim)' }}>Q {currentIdx + 1}/{test.questions.length}</p></div>
                <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock size={20} color="#8b5cf6" />
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
            </header>
            <AnimatePresence mode="wait">
                <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2.5rem' }}>{q.question_text}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {q.options.map((opt, i) => (
                            <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '1.25rem', textAlign: 'left', background: selected === opt ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected === opt ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, borderRadius: '1rem', color: 'white', cursor: 'pointer' }}>{opt}</button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}><ChevronLeft /> Prev</button>
                {currentIdx === test.questions.length - 1 ? <button onClick={handleSubmit} className="btn btn-primary">Submit <Send size={18} /></button> : <button onClick={() => setCurrentIdx(prev => prev + 1)} className="btn btn-primary">Next <ChevronRight /></button>}
            </div>
        </div>
    );
};

export default TakeTest;

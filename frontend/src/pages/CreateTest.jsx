import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';

const CreateTest = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    const navigate = useNavigate();

    const addQuestion = () => setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    const removeQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx));

    const updateQuestion = (idx, field, val) => {
        const newQs = [...questions];
        newQs[idx][field] = val;
        setQuestions(newQs);
    };

    const updateOption = (qIdx, oIdx, val) => {
        const newQs = [...questions];
        newQs[qIdx].options[oIdx] = val;
        setQuestions(newQs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/tests', { title, description, questions }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Test Created!');
            navigate('/teacher');
        } catch (err) { alert('Failed to create test'); }
    };

    return (
        <div style={{ padding: '2rem 4rem' }}>
            <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Design New Test</h1>
            <form onSubmit={handleSubmit}>
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <input className="input-field" placeholder="Test Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ fontSize: '1.2rem', fontWeight: 600 }} />
                    <textarea className="input-field" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ height: '80px', resize: 'none' }} />
                </div>
                {questions.map((q, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ color: 'var(--primary)' }}>Question {i + 1}</h4>
                            <button type="button" onClick={() => removeQuestion(i)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}><Trash2 size={20} /></button>
                        </div>
                        <input className="input-field" placeholder="Question text..." value={q.question_text} onChange={e => updateQuestion(i, 'question_text', e.target.value)} required />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {q.options.map((opt, oi) => (
                                <input key={oi} className="input-field" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateOption(i, oi, e.target.value)} required />
                            ))}
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginRight: '1rem' }}>Correct Answer:</label>
                            <select className="input-field" style={{ width: 'auto' }} value={q.correct_answer} onChange={e => updateQuestion(i, 'correct_answer', e.target.value)} required>
                                <option value="">Select Correct Option</option>
                                {q.options.map((opt, oi) => <option key={oi} value={opt}>{opt || `Option ${oi + 1}`}</option>)}
                            </select>
                        </div>
                    </motion.div>
                ))}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" onClick={addQuestion} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}><Plus size={20} /> Add Question</button>
                    <button type="submit" className="btn btn-primary"><Save size={20} /> Publish Test</button>
                </div>
            </form>
        </div>
    );
};

export default CreateTest;

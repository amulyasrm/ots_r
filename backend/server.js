require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'premium_secret_key_123';

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [username, hashed, role], function (err) {
        if (err) return res.status(400).json({ error: 'Username already exists' });
        res.json({ message: 'User registered successfully', id: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    });
});

// --- TEACHER ROUTES ---

// Create Test
app.post('/api/tests', authenticate, (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
    const { title, description, questions } = req.body;

    db.run(`INSERT INTO tests (title, description, teacher_id) VALUES (?, ?, ?)`, [title, description, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        const testId = this.lastID;

        const stmt = db.prepare(`INSERT INTO questions (test_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)`);
        questions.forEach(q => {
            stmt.run(testId, q.question_text, JSON.stringify(q.options), q.correct_answer);
        });
        stmt.finalize();

        res.json({ message: 'Test created', testId });
    });
});

// View performance (all users who attempted teacher's tests)
app.get('/api/teacher/results', authenticate, (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
    db.all(`
    SELECT r.*, t.title as test_title, u.username as student_name 
    FROM results r
    JOIN tests t ON r.test_id = t.id
    JOIN users u ON r.student_id = u.id
    WHERE t.teacher_id = ?
  `, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- STUDENT ROUTES ---

// Get Available Tests
app.get('/api/tests', authenticate, (req, res) => {
    db.all(`SELECT id, title, description, created_at FROM tests`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Test Details (including questions)
app.get('/api/tests/:id', authenticate, (req, res) => {
    db.get(`SELECT * FROM tests WHERE id = ?`, [req.params.id], (err, test) => {
        if (err || !test) return res.status(404).json({ error: 'Test not found' });
        db.all(`SELECT id, question_text, options FROM questions WHERE test_id = ?`, [test.id], (err, questions) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...test, questions: questions.map(q => ({ ...q, options: JSON.parse(q.options) })) });
        });
    });
});

// Submit Test
app.post('/api/tests/:id/submit', authenticate, (req, res) => {
    const { answers } = req.body; // Array of { questionId, answer }
    db.all(`SELECT id, correct_answer FROM questions WHERE test_id = ?`, [req.params.id], (err, questions) => {
        if (err) return res.status(500).json({ error: err.message });

        let score = 0;
        questions.forEach(q => {
            const userAns = answers.find(a => a.questionId === q.id);
            if (userAns && userAns.answer === q.correct_answer) {
                score++;
            }
        });

        db.run(`INSERT INTO results (test_id, student_id, score, total) VALUES (?, ?, ?, ?)`,
            [req.params.id, req.user.id, score, questions.length], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ score, total: questions.length });
            });
    });
});

// Student History
app.get('/api/student/history', authenticate, (req, res) => {
    db.all(`
    SELECT r.*, t.title as test_title 
    FROM results r
    JOIN tests t ON r.test_id = t.id
    WHERE r.student_id = ?
  `, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

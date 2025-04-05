const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const router = express.Router();

const requireAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.role !== 'admin') return res.redirect('/login.html');
    next();
};

router.use(requireAdmin);

// Staff
router.get('/staff', (req, res) => {
    db.all('SELECT u.*, p.name AS position_name FROM users u LEFT JOIN positions p ON u.position_id = p.id', [], (err, staffs) => {
        res.json(err ? { error: err.message } : staffs);
    });
});

router.post('/staff', (req, res) => {
    const { username, password, full_name, position_id, role } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        db.run('INSERT INTO users (username, password, full_name, position_id, role) VALUES (?, ?, ?, ?, ?)',
            [username, hash, full_name, position_id || null, role], (err) => {
                res.json(err ? { error: err.message } : { success: true });
            });
    });
});

router.put('/staff/:id', (req, res) => {
    const { username, full_name, position_id, role, password } = req.body;
    if (password) {
        bcrypt.hash(password, 10, (err, hash) => {
            db.run('UPDATE users SET username = ?, full_name = ?, position_id = ?, role = ?, password = ? WHERE id = ?',
                [username, full_name, position_id || null, role, hash, req.params.id], (err) => {
                    res.json(err ? { error: err.message } : { success: true });
                });
        });
    } else {
        db.run('UPDATE users SET username = ?, full_name = ?, position_id = ?, role = ? WHERE id = ?',
            [username, full_name, position_id || null, role, req.params.id], (err) => {
                res.json(err ? { error: err.message } : { success: true });
            });
    }
});

router.delete('/staff/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

// Positions
router.get('/positions', (req, res) => {
    db.all('SELECT * FROM positions', [], (err, positions) => {
        res.json(err ? { error: err.message } : positions);
    });
});

router.post('/positions', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO positions (name) VALUES (?)', [name], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

router.delete('/positions/:id', (req, res) => {
    db.run('DELETE FROM positions WHERE id = ?', [req.params.id], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

// Working Hours
router.get('/working-hours', (req, res) => {
    db.all('SELECT wh.*, u.username FROM working_hours wh JOIN users u ON wh.user_id = u.id', [], (err, hours) => {
        res.json(err ? { error: err.message } : hours);
    });
});

router.post('/working-hours', (req, res) => {
    const { user_id, date, hours } = req.body;
    db.run('INSERT INTO working_hours (user_id, date, hours) VALUES (?, ?, ?)', [user_id, date, hours], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

router.delete('/working-hours/:id', (req, res) => {
    db.run('DELETE FROM working_hours WHERE id = ?', [req.params.id], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

// Attendance
router.get('/attendance', (req, res) => {
    db.all('SELECT a.*, u.username FROM attendance a JOIN users u ON a.user_id = u.id', [], (err, attendance) => {
        res.json(err ? { error: err.message } : attendance);
    });
});

// Salaries
router.get('/salaries', (req, res) => {
    db.all('SELECT s.*, u.username FROM salaries s JOIN users u ON s.user_id = u.id', [], (err, salaries) => {
        res.json(err ? { error: err.message } : salaries);
    });
});

router.post('/salaries', (req, res) => {
    const { user_id, amount, month } = req.body;
    db.run('INSERT INTO salaries (user_id, amount, month) VALUES (?, ?, ?)', [user_id, amount, month], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

router.delete('/salaries/:id', (req, res) => {
    db.run('DELETE FROM salaries WHERE id = ?', [req.params.id], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

// Reward/Discipline
router.get('/reward-discipline', (req, res) => {
    db.all('SELECT rd.*, u.username FROM reward_discipline rd JOIN users u ON rd.user_id = u.id', [], (err, records) => {
        res.json(err ? { error: err.message } : records);
    });
});

router.post('/reward-discipline', (req, res) => {
    const { user_id, type, description, date } = req.body;
    db.run('INSERT INTO reward_discipline (user_id, type, description, date) VALUES (?, ?, ?, ?)',
        [user_id, type, description, date], (err) => {
            res.json(err ? { error: err.message } : { success: true });
        });
});

router.delete('/reward-discipline/:id', (req, res) => {
    db.run('DELETE FROM reward_discipline WHERE id = ?', [req.params.id], (err) => {
        res.json(err ? { error: err.message } : { success: true });
    });
});

// Statistics
router.get('/statistics', (req, res) => {
    db.all('SELECT u.username, SUM(wh.hours) as total_hours FROM working_hours wh JOIN users u ON wh.user_id = u.id GROUP BY u.id, u.username', [], (err, stats) => {
        res.json(err ? { error: err.message } : stats);
    });
});

// check db
router.get('/database', (req, res) => {
    const tables = ['users', 'positions', 'working_hours', 'attendance', 'salaries', 'reward_discipline'];
    const result = {};
    let completed = 0;

    tables.forEach(table => {
        db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
            result[table] = err ? { error: err.message } : rows;
            completed++;
            if (completed === tables.length) res.json(result);
        });
    });
});

module.exports = router;
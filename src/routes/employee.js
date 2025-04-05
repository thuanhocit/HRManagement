const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const router = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login.html');
    next();
};

router.use(requireLogin);

// Attendance
router.get('/attendance', (req, res) => {
    db.all('SELECT * FROM attendance WHERE user_id = ?', [req.session.userId], (err, attendance) => {
        res.json(err ? { error: err.message } : attendance);
    });
});

router.post('/attendance', (req, res) => {
    const { check_in, check_out } = req.body;
    if (!check_in && !check_out) {
        return res.json({ success: false, message: 'Vui lòng cung cấp check_in hoặc check_out!' });
    }

    const date = new Date().toISOString().split('T')[0];

    db.get('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [req.session.userId, date], (err, row) => {
        if (err) return res.json({ error: err.message });

        if (row) {
            // Nếu đã có check-in nhưng chưa có check-out, cập nhật check-out
            if (!row.check_out && check_out) {
                db.run('UPDATE attendance SET check_out = ? WHERE user_id = ? AND date = ?',
                    [check_out, req.session.userId, date], (err) => {
                        res.json(err ? { error: err.message } : { success: true, message: 'Đã cập nhật check-out!' });
                    });
            } else {
                res.json({ success: false, message: 'Bạn đã chấm công hôm nay!' });
            }
        } else {
            // Nếu chưa có dữ liệu, tạo mới
            db.run('INSERT INTO attendance (user_id, check_in, check_out, date) VALUES (?, ?, ?, ?)',
                [req.session.userId, check_in || null, check_out || null, date], (err) => {
                    res.json(err ? { error: err.message } : { success: true, message: 'Chấm công thành công!' });
                });
        }
    });
});


// Profile
router.get('/profile', (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.session.userId], (err, user) => {
        res.json(err ? { error: err.message } : user);
    });
});

router.put('/profile', (req, res) => {
    const { full_name, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        db.run('UPDATE users SET full_name = ?, password = ? WHERE id = ?',
            [full_name, hash, req.session.userId], (err) => {
                res.json(err ? { error: err.message } : { success: true });
            });
    });
});

module.exports = router;
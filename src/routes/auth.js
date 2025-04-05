const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }
        req.session.userId = user.id;
        req.session.role = user.role;
        res.json({ success: true, role: user.role });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

router.get('/check-session', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, role: req.session.role, userId: req.session.userId });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const db = new sqlite3.Database(path.join(__dirname, '../../db/database.sqlite'), (err) => {
    if (err) console.error('Database connection error:', err.message);
    console.log('Connected to SQLite database');
});

db.serialize(() => {
    // Tạo bảng
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT,
            position_id INTEGER,
            role TEXT DEFAULT 'employee',
            FOREIGN KEY (position_id) REFERENCES positions(id)
        )`);
    db.run(`
        CREATE TABLE IF NOT EXISTS positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);
    db.run(`
        CREATE TABLE IF NOT EXISTS working_hours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT,
            hours REAL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            check_in TEXT,
            check_out TEXT,
            date TEXT,
            UNIQUE(user_id, date),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    db.run(`
        CREATE TABLE IF NOT EXISTS salaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount REAL,
            month TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    db.run(`
        CREATE TABLE IF NOT EXISTS reward_discipline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT CHECK(type IN ('reward', 'discipline')),
            description TEXT,
            date TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

    // Thêm dữ liệu mẫu
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
        if (row.count === 0) {
            const adminHash = await bcrypt.hash('admin123', 10);
            const empHash = await bcrypt.hash('employee123', 10);
            db.run('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
                ['admin', adminHash, 'Quản trị viên', 'admin']);
            db.run('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)',
                ['employee', empHash, 'Nhân viên mẫu']);
            db.run('INSERT INTO positions (name) VALUES (?)', ['Nhân viên']);
            db.run('INSERT INTO positions (name) VALUES (?)', ['Quản lý']);
        }
    });
});

module.exports = db;
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(require('express-session')({ secret: 'hrmanagement-secret', resave: false, saveUninitialized: false }));

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
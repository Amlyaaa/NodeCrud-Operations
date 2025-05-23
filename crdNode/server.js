const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'users'
});

//Get All Users
app.get('/users', (req, res) => {
    const stmt = 'select * from users';
    pool.execute(stmt, [], (err, result) => {
        if (err){
             return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

//Get User by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const stmt = 'select * from users where id = ?';
    pool.execute(stmt, [id], (err, result) => {
        if (err){
            return res.status(500).json({ error: err });
        } 
        res.json(result);
    });
});

//Add New User
app.post('/users', (req, res) => {
    const { name, email, password, phone } = req.body;
    const stmt = 'insert into users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    pool.execute(stmt, [name, email, password, phone], (err, result) => {
        if (err){
            return res.status(500).json({ error: err });
        } 
        res.json({ id: result.insertId });
    });
});

// Delete User
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const stmt = 'DELETE FROM users WHERE id = ?';
    pool.execute(stmt, [id], (err) => {
        if (err){

            return res.status(500).json({ error: err });
        }
        res.json({ message: 'User deleted' });
    });
});

// Update User
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;
    const stmt = 'update users set name = ?, email = ?, password = ?, phone = ? WHERE id = ?';
    pool.execute(stmt, [name, email, password, phone, id], (err) => {
        if (err){
             return res.status(500).json({ error: err });
        } 
        res.json({ message: 'User updated' });
    });
});

// Search Users by name
app.get('/users/search/:term', (req, res) => {
    const { term } = req.params;
    const likeTerm = `%${term}%`;
   const stmt = 'select * from users where LOWER(name) like LOWER(?) or LOWER(email) like LOWER(?)';
    pool.execute(stmt, [likeTerm, likeTerm], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// Filter Users by phone
app.get('/users/filter/phone/:phone', (req, res) => {
    const { phone } = req.params;
    const stmt = 'select * from users where phone = ?';
    pool.execute(stmt, [phone], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Bulk Add Users
app.post('/users/bulk', (req, res) => {
    const users = req.body; // Array of {name, email, password, phone}
    const values = users.map(({ name, email, password, phone }) => [name, email, password, phone]);
    const stmt = 'insert into users (name, email, password, phone) VALUES ?';
    pool.query(stmt, [values], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ inserted: result.affectedRows });
    });
});

// Pagination
app.get('/users/page/:page/limit/:limit', (req, res) => {
    const page = parseInt(req.params.page, 10);
    const limit = parseInt(req.params.limit, 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Invalid page or limit values' });
    }

    const offset = (page - 1) * limit;

    const stmt = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;

    pool.query(stmt, (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});


//start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

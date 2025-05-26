// const multer = require('multer');
// const csv = require('csv-parser');
// const fs = require('fs');
// const express = require('express');
// const { pool, poolConnect, sql } = require('../config/db');  // Import the corrected connection
// const router = express.Router();


// // Get All Users
// router.get('/', async (req, res) => {
//     try {
//         await poolConnect; // Wait for connection
//         const result = await pool.request().query('SELECT * FROM users');
//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get User by ID
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await poolConnect;
//         const result = await pool.request()
//             .input('id', sql.Int, id)
//             .query('SELECT * FROM users WHERE id = @id');
//         res.json(result.recordset[0] || null);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Add New User
// router.post('/', async (req, res) => {
//     const { name, email, password, phone } = req.body;
//     try {
//         await poolConnect;
//         await pool.request()
//             .input('name', sql.NVarChar, name)
//             .input('email', sql.NVarChar, email)
//             .input('password', sql.NVarChar, password)
//             .input('phone', sql.NVarChar, phone)
//             .query(`
//                 INSERT INTO users (name, email, password, phone)
//                 VALUES (@name, @email, @password, @phone)
//             `);
//         res.status(201).json({ message: 'User added' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update User
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, email, password, phone } = req.body;
//     try {
//         await poolConnect;
//         await pool.request()
//             .input('id', sql.Int, id)
//             .input('name', sql.NVarChar, name)
//             .input('email', sql.NVarChar, email)
//             .input('password', sql.NVarChar, password)
//             .input('phone', sql.NVarChar, phone)
//             .query(`
//                 UPDATE users 
//                 SET name = @name, email = @email, 
//                     password = @password, phone = @phone
//                 WHERE id = @id
//             `);
//         res.json({ message: 'User updated' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Delete User
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await poolConnect;
//         await pool.request()
//             .input('id', sql.Int, id)
//             .query('DELETE FROM users WHERE id = @id');
//         res.json({ message: 'User deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Search Users
// // Search Users with query param
// router.get('/search', async (req, res) => {
//     const { term } = req.query;
//     if (!term) {
//         return res.status(400).json({ error: 'Search term is required' });
//     }

//     try {
//         await poolConnect;
//         const result = await pool.request()
//             .input('term', sql.NVarChar, `%${term}%`)
//             .query(`
//                 SELECT * FROM users 
//                 WHERE name LIKE @term OR email LIKE @term
//             `);
//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// // Filter by Phone with query param
// router.get('/filter/phone', async (req, res) => {
//     const { phone } = req.query;
//     if (!phone) {
//         return res.status(400).json({ error: 'Phone number is required' });
//     }

//     try {
//         await poolConnect;
//         const result = await pool.request()
//             .input('phone', sql.NVarChar, phone)
//             .query('SELECT * FROM users WHERE phone = @phone');
//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// const upload = multer({ dest: 'uploads/' });

// // Bulk Add Users from CSV File
// router.post('/bulk/csv', upload.single('file'), async (req, res) => {
//     const filePath = req.file.path;
//     const users = [];
    
//     // Parse the CSV file
//     fs.createReadStream(filePath)
//         .pipe(csv())
//         .on('data', (row) => {
//             users.push({
//                 name: row.name,
//                 email: row.email,
//                 password: row.password,
//                 phone: row.phone
//             });
//         })
//         .on('end', async () => {
//             const transaction = new sql.Transaction(pool);

//             try {
//                 await poolConnect;
//                 await transaction.begin();
                
//                 for (const user of users) {
//                     const request = new sql.Request(transaction);
//                     await request
//                         .input('name', sql.NVarChar, user.name)
//                         .input('email', sql.NVarChar, user.email)
//                         .input('password', sql.NVarChar, user.password)
//                         .input('phone', sql.NVarChar, user.phone)
//                         .query(`
//                             INSERT INTO users (name, email, password, phone)
//                             VALUES (@name, @email, @password, @phone)
//                         `);
//                 }

//                 await transaction.commit();
//                 res.status(201).json({ inserted: users.length });
//             } catch (err) {
//                 await transaction.rollback();
//                 res.status(500).json({ error: err.message });
//             }
//         });
// });

// // Pagination
// // Pagination with query params
// router.get('/page', async (req, res) => {
//     const { page, limit } = req.query;
//     const pageNum = parseInt(page, 10);
//     const limitNum = parseInt(limit, 10);
//     const offset = (pageNum - 1) * limitNum;

//     if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
//         return res.status(400).json({ error: 'Invalid page or limit values' });
//     }

//     try {
//         await poolConnect;
//         const result = await pool.request()
//             .input('offset', sql.Int, offset)
//             .input('limit', sql.Int, limitNum)
//             .query(`
//                 SELECT * FROM users 
//                 ORDER BY id 
//                 OFFSET @offset ROWS 
//                 FETCH NEXT @limit ROWS ONLY
//             `);
//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;

console.log("users.js file loaded");
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();
const app = express();
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Get all users
router.get('/', async (req, res) => {

      console.log("Route GET /users/ is triggered");

    try {
        pool.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results[0] || null);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        pool.query(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, password, phone],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ 
                    message: 'User created successfully',
                    userId: results.insertId 
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;
    try {
        pool.query(
            'UPDATE users SET name = ?, email = ?, password = ?, phone = ? WHERE id = ?',
            [name, email, password, phone, id],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'User updated successfully' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        pool.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User deleted successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//search by name and email
router.get('/search', (req, res) => {
    const { term } = req.query;

    // Validate search term
    if (!term || term.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
    }

    const searchTerm = `%${term.trim()}%`;

    pool.query(
        'SELECT id, name, email, phone FROM users WHERE name LIKE ? OR email LIKE ?',
        [searchTerm, searchTerm],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
            }

            // Return results or a not found message
            if (results.length === 0) {
                return res.status(404).json({ message: 'No users found matching your search' });
            }

            res.json(results);
        }
    );
});




// Filter users by phone
router.get('/filter/phone', async (req, res) => {
    const { phone } = req.query;
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        pool.query('SELECT * FROM users WHERE phone = ?', [phone], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Bulk import users from CSV
router.post('/bulk-import', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const users = [];
    
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            users.push([row.name, row.email, row.password, row.phone]);
        })
        .on('end', () => {
            const sql = 'INSERT INTO users (name, email, password, phone) VALUES ?';
            
            pool.query(sql, [users], (err, results) => {
                // Clean up the uploaded file
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                });

                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ 
                    message: 'Bulk import successful',
                    insertedRows: results.affectedRows 
                });
            });
        })
        .on('error', (error) => {
            fs.unlink(filePath, () => {});
            res.status(500).json({ error: error.message });
        });
});


// Paginate users
router.get('/paginate', async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    // Check if page and limit are valid
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Invalid page or limit values' });
    }

    try {
        pool.query(
            'SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?',
            [limit, offset],
            (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).json({ error: err.message });
                }
                console.log('Pagination Results:', results); // Debugging log
                if (results.length === 0) {
                    return res.status(404).json({ message: 'No users found for this page' });
                }
                res.json(results);
            }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: err.message });
    }
});

 

module.exports = router;    
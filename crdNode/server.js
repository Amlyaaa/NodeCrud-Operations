const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/users'); // Import user routes
const { pool } = require('./config/db'); // Import the pool

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected successfully');
    connection.release();
  }
});

// Mount user routes under '/users'
 
app.use('/users',usersRoutes); 
console.log('✅ /users routes mounted');//removed "/users"

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});


 
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
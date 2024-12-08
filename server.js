const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
const port = 3000;
const host = '0.0.0.0';  // Listen on all network interfaces

// Enable CORS for your specific domain
app.use(cors({
  origin: 'https://lucasengpiserver.duckdns.org',
  optionsSuccessStatus: 200
}));

// Database configuration
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'lucas',
  password: 'Neon96carNYU?',
  database: 'studentdatabase',
  connectTimeout: 10000,
  socketPath: undefined  // Force TCP/IP connection instead of socket
};

// Create database connection pool
let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure MySQL server is running and the connection details are correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Check your username and password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist');
    }

    throw error;
  }
}

// API endpoint to get all records
app.get('/api/students', async (req, res) => {
  try {
    // Replace 'students' with your actual table name
    const [rows] = await pool.execute('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ 
      error: 'Database error', 
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Server error', 
    message: err.message 
  });
});

// Start the server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}`);
      console.log(`Access externally at https://lucasengpiserver.duckdns.org`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed.');
  }
  process.exit(0);
});

// Start the server
startServer();
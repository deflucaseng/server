const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
const port = 8000;
const host = '0.0.0.0';  // Listen on all network interfaces

// Add JSON body parser middleware
app.use(express.json());



// Enable CORS for your specific domain
const isDevelopment = process.env.NODE_ENV === 'development';

app.use(cors({
  origin: isDevelopment
  ? '*'
  : [
    'http://lucasengpiserver.duckdns.org',
    'http://127.0.0.1:5500'
  ],
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

// Middleware to log IP addresses
const logIP = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Request from IP: ${ip} - ${req.method} ${req.path}`);
  next();
};

// Apply IP logging middleware to all routes
app.use(logIP);

// Basic query validation middleware
const validateQuery = (req, res, next) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  // Basic security checks
  const forbiddenKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER'];
  const upperQuery = query.toUpperCase();
  
  if (!upperQuery.startsWith('SELECT')) {
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  }
  
  for (const keyword of forbiddenKeywords) {
    if (upperQuery.includes(keyword)) {
      return res.status(403).json({ 
        error: 'Query contains forbidden keywords',
        message: `The keyword "${keyword}" is not allowed`
      });
    }
  }
  
  next();
};

// API endpoint to execute custom query
app.post('/api/query', validateQuery, async (req, res) => {
  const { query, params } = req.body;
  
  try {
    console.log(`Executing query: ${query}`);
    console.log(`With parameters:`, params || []);
    
    const [rows] = await pool.execute(query, params || []);
    res.json({
      success: true,
      results: rows,
      rowCount: rows.length
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error', 
      message: error.message 
    });
  }
});

// Keep the original endpoint for backward compatibility
app.get('/api/students', async (req, res) => {
  try {
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

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
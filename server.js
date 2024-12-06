const express = require('express');
const mysql = require('mysql2/promise'); // Using mysql2 for Promise support
const app = express();

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Middleware to parse JSON requests
app.use(express.json());

// Route to get data with limit parameter
app.get('/api/data', async (req, res) => {
  try {
    // Get the limit from query parameter, default to 10 if not specified
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate limit
    if (limit < 0 || limit > 100) {
      return res.status(400).json({
        error: 'Limit must be between 0 and 100'
      });
    }

    // Get database connection from pool
    const connection = await pool.getConnection();
    
    try {
      // Execute query with LIMIT
      const [rows] = await connection.execute(
        'SELECT * FROM your_table LIMIT ?',
        [limit]
      );

      // Return JSON response
      res.json({
        count: rows.length,
        data: rows
      });
    } finally {
      // Always release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
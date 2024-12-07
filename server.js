const mysql = require('mysql2/promise');


async function connectToDatabase() {
  const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'lucas',
    password: 'Neon96carN',
    database: 'studentdatabase',
    connectTimeout: 10000,
    socketPath: undefined  // Force TCP/IP connection instead of socket
  };

  try {
    // Create connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    


    
    // Release the connection back to the pool
    connection.release();
    
    return pool;
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

async function getAllRecords(pool) {
  try {
    // Execute SELECT * query
    const [rows] = await pool.execute('SELECT * FROM studentdatabase.*');
    
    // Convert the results to JSON
    const jsonResult = JSON.stringify(rows, null, 2);
    
    console.log('Query results:', jsonResult);
    return jsonResult;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Usage example
async function main() {
  try {
    const pool = await connectToDatabase();
    
    // Get all records and convert to JSON
    const results = await getAllRecords(pool);
    
    // Remember to end the pool when your application exits
    await pool.end();
    
    return results;
  } catch (error) {
    console.error('Application error:', error);
    process.exit(1);
  }
}

// Run the main function
main();
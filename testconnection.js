const mysql = require('mysql2/promise');

async function loadData() {
  const dbConfig = {
    host: '127.0.0.1',  // Using explicit IP instead of ::1
    port: 3306,
    user: 'root',       // Use your MySQL username
    password: '',       // Your MySQL password
    database: 'studentdata',   // Your database name
    debug: true,        // Enable debugging
    trace: true
  };

  let connection;
  
  try {
    console.log('Attempting to connect to MySQL...');
    console.log('Connection config:', { ...dbConfig, password: '****' });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected!');
    
    // Test the connection
    const [rows] = await connection.execute('SELECT 1');
    console.log('Test query successful:', rows);
    
  } catch (error) {
    console.error('Connection error details:');
    console.error('Error code:', error.code);
    console.error('Error number:', error.errno);
    console.error('Error message:', error.message);
    console.error('SQL state:', error.sqlState);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
  }
}

loadData();
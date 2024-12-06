const mysql = require('mysql2/promise');

const data = [
	{  
	  "name":"arun",
	  "gender":"Male",
	  "physics":88,
	  "maths":87,
	  "english":78
	},
	{  
	  "name":"rajesh",
	  "gender":"Male",
	  "physics":96,
	  "maths":100,
	  "english":95
	},
	{  
	  "name":"moorthy",
	  "gender":"Male",
	  "physics":89,
	  "maths":90,
	  "english":70
	},
	{  
	  "name":"raja",
	  "gender":"Male",
	  "physics":30,
	  "maths":25,
	  "english":40
	},
	{  
	  "name":"usha",
	  "gender":"Female",
	  "physics":67,
	  "maths":45,
	  "english":78
	},
	{  
	  "name":"priya",
	  "gender":"Female",
	  "physics":56,
	  "maths":46,
	  "english":78
	},
	{  
	  "name":"Sundar",
	  "gender":"Male",
	  "physics":12,
	  "maths":67,
	  "english":67
	},
	{  
	  "name":"Kavitha",
	  "gender":"Female",
	  "physics":78,
	  "maths":71,
	  "english":67
	},
	{  
	  "name":"Dinesh",
	  "gender":"Male",
	  "physics":56,
	  "maths":45,
	  "english":67
	},
	{  
	  "name":"Hema",
	  "gender":"Female",
	  "physics":71,
	  "maths":90,
	  "english":23
	},
	{  
	  "name":"Gowri",
	  "gender":"Female",
	  "physics":100,
	  "maths":100,
	  "english":100
	},
	{  
	  "name":"Ram",
	  "gender":"Male",
	  "physics":78,
	  "maths":55,
	  "english":47
	},
	{  
	  "name":"Murugan",
	  "gender":"Male",
	  "physics":34,
	  "maths":89,
	  "english":78
	},
	{  
	  "name":"Jenifer",
	  "gender":"Female",
	  "physics":67,
	  "maths":88,
	  "english":90
	}
  ];


async function connectToDatabase() {
  const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'lucas',
    password: 'raspberry',
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
    

    const insertQuery = `
      INSERT INTO students (name, gender, physics, maths, english)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    for (const student of data) {
      await connection.execute(insertQuery, [
        student.name,
        student.gender,
        student.physics,
        student.maths,
        student.english
      ]);
    }
    
    console.log(`Successfully inserted ${data.length} records`);
    
    // Verify the data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM students');
    console.log(`Total records in database: ${rows[0].count}`);
    
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

// Usage example
async function main() {
  try {
    const pool = await connectToDatabase();
    
    // Fixed query using underscore in alias name

    
    // Remember to end the pool when your application exits
    await pool.end();
  } catch (error) {
    console.error('Application error:', error);
    process.exit(1);
  }
}

// Run the main function
main();
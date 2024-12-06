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

async function loadData() {
  // Database configuration
  const dbConfig = {
	host: '127.0.0.1',
	port: 3306,
	user: 'lucas',
	password: 'raspberry',
	database: 'studentdatabase',
	connectTimeout: 10000,
	socketPath: undefined  // Force TCP/IP connection instead of socket
  };

  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gender ENUM('Male', 'Female') NOT NULL,
        physics INT NOT NULL,
        maths INT NOT NULL,
        english INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('Table created or already exists');
    
    // Insert data
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
    
  } catch (error) {
	console.error('Detailed connection error:', {
		message: error.message,
		code: error.code,
		errno: error.errno,
		sqlState: error.sqlState,
		host: dbConfig.host,
		port: dbConfig.port
	  });
	  throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the script
loadData();
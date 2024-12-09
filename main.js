// Using fetch API for HTTP requests
async function sendGetRequest(url) {
    /**
     * Send a GET request to the specified URL.
     */
    try {
        const response = await fetch(url, {
            method: 'GET',
            // Note: rejectUnauthorized: false equivalent is not directly available in fetch
            // You might need to handle this differently depending on your environment
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await processResponse(response);
    } catch (e) {
        console.error(`An error occurred during GET request: ${e}`);
        return null;
    }
}

async function sendSqlQuery(baseUrl, query, params = null) {
    /**
     * Send a SQL query to the API endpoint.
     */
    try {
        // Construct the full URL for the query endpoint
        const url = `${baseUrl}/api/query`;
        
        // Prepare the request payload
        const payload = {
            query: query,
            params: params || []
        };
        
        // Make the POST request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await processResponse(response);
    } catch (e) {
        console.error(`An error occurred during POST request: ${e}`);
        return null;
    }
}

async function processResponse(response) {
    /**
     * Process the API response.
     */
    console.log(`\nStatus Code: ${response.status}`);
    
    try {
        const jsonData = await response.json();
        console.log('Response Content:', JSON.stringify(jsonData, null, 2));
        return jsonData;
    } catch (e) {
        const textData = await response.text();
        console.log('Raw Response Content:', textData);
        return null;
    }
}

async function main() {
    // Configuration
    const baseUrl = 'http://lucasengpiserver.duckdns.org:8000';
    
    // Example queries
    const queries = [
        {
            name: 'Get all students',
            query: 'SELECT * FROM students',
            params: []
        },
        {
            name: 'Get students with high grades',
            query: 'SELECT * FROM students WHERE maths > ?',
            params: [90]
        }
    ];
    
    // Execute each query
    for (const queryInfo of queries) {
        console.log(`\nExecuting: ${queryInfo.name}`);
        console.log(`Query: ${queryInfo.query}`);
        console.log(`Parameters: ${queryInfo.params}`);
        
        const result = await sendSqlQuery(baseUrl, queryInfo.query, queryInfo.params);
        
        if (result && Array.isArray(result.results)) {
            console.log(`Number of rows returned: ${result.results.length}`);
        }
    }
}

// JavaScript equivalent of if __name__ == '__main__':
if (typeof require !== 'undefined' && require.main === module) {
    main().catch(error => console.error('Error in main:', error));
}
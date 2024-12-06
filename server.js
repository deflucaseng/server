const http = require('http');

const port = 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Test test test!');
  
  // Shut down the server after sending the response
  server.close(() => {
    console.log('Server has been shut down.');
    process.exit(0);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
from http.server import HTTPServer, BaseHTTPRequestHandler
import argparse

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'Hello, World!')

def run_server(port=8000):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Server running on all interfaces, port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run a simple HTTP server")
    parser.add_argument('--port', type=int, default=8000, help="Port to run the server on")
    args = parser.parse_args()
    
    run_server(args.port)
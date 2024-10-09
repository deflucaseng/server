from http.server import HTTPServer, SimpleHTTPRequestHandler
import platform
import psutil
import ssl
import os

class RaspberryPiHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        # Gather system information
        system_info = f"""
        System: {platform.system()} {platform.release()}
        Machine: {platform.machine()}
        Processor: {platform.processor()}
        Temperature: {psutil.sensors_temperatures()['cpu_thermal'][0].current:.1f}°C
        CPU Usage: {psutil.cpu_percent()}%
        Memory Usage: {psutil.virtual_memory().percent}%
        Disk Usage: {psutil.disk_usage('/').percent}%
        """

        response = f"Hello from your Raspberry Pi!\n\nSystem Information:\n{system_info}"
        self.wfile.write(response.encode())

def run_server(port=8080, use_https=False):
    server_address = ('0.0.0.0', port)  # Bind to all interfaces
    httpd = HTTPServer(server_address, RaspberryPiHandler)
    
    if use_https:
        # Paths to your SSL certificate and key
        certfile = "/path/to/your/fullchain.pem"
        keyfile = "/path/to/your/privkey.pem"
        
        if not (os.path.exists(certfile) and os.path.exists(keyfile)):
            print("SSL certificate files not found. Running in HTTP mode.")
        else:
            httpd.socket = ssl.wrap_socket(httpd.socket, 
                                           certfile=certfile, 
                                           keyfile=keyfile, 
                                           server_side=True)
            print(f"Server running on https://0.0.0.0:{port}")
    else:
        print(f"Server running on http://0.0.0.0:{port}")
    
    print("Make sure port forwarding is set up on your router.")
    print("Access the server using your DuckDNS domain.")
    
    httpd.serve_forever()

if __name__ == "__main__":
    run_server(port=8080, use_https=False)  # Set use_https=True if you have SSL certificates
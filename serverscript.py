from http.server import HTTPServer, SimpleHTTPRequestHandler
import platform
import psutil

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

def run_server(port=8000):
    server_address = ('192.168.1.112', port)  # Using the IPv4 address from the SSH info
    httpd = HTTPServer(server_address, RaspberryPiHandler)
    print(f"Server running on http://192.168.1.112:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
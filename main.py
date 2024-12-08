import requests

def send_request(url):
    try:
        # Make the GET request with SSL verification disabled (only for testing)
        response = requests.get(url, verify=False)
        
        # Check if the request was successful
        response.raise_for_status()
        
        # Print status code and response
        print(f"Status Code: {response.status_code}")
        
        # Try to parse and print JSON response
        try:
            json_data = response.json()
            print("Response Content:", json_data)
        except ValueError:
            print("Raw Response Content:", response.text)
            
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    # Use HTTPS and include port
    base_url = "http://lucasengpiserver.duckdns.org:8000"
    endpoint = "/api/students"
    url = base_url + endpoint
    
    print(f"Sending request to: {url}")
    send_request(url)
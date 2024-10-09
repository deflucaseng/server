import requests

def send_request():
    url = "http://lucasengpiserver.duckdns.org:8080"  # Replace with your actual DuckDNS domain
    try:
        response = requests.get(url, timeout=30)  # Increased timeout for potential slower connection
        response.raise_for_status()  # Raises an HTTPError for bad responses
        print(f"Status Code: {response.status_code}")
        print(f"Response Content:\n{response.text}")
    except requests.exceptions.Timeout:
        print("The request timed out. The server might be slow to respond or unreachable.")
    except requests.exceptions.ConnectionError:
        print("Failed to connect to the server. Check if the domain is correct and the server is running.")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error occurred: {e}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    send_request()
import requests
import argparse

def send_request(url):
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Send a request to an HTTP server")
    parser.add_argument('url', help="URL of the server to connect to")
    args = parser.parse_args()
    
    send_request(args.url)
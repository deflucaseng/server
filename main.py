import requests

def send_request(url, ):
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    url = "http://lucasengpiserver.duckdns.org:8000"
    
    send_request(url)
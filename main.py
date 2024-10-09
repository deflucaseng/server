import requests

def send_request():
    url = "http://192.168.1.112:8000"  # The URL of your Raspberry Pi server
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Content:\n{response.text}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    send_request()
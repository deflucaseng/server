import requests

def send_request(url, input_string):
    try:
        response = requests.get(url, params={'input': input_string})
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    url = "http://lucasengpiserver.duckdns.org:8000"
    input_string = input("Enter a string to send with the request: ")
    
    send_request(url, input_string)
import requests

def main():
    url = 'http://lucasengpiserver.duckdns.org:22'
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
    except requests.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
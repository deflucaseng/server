import requests
import json

def send_get_request(url):
    """Send a GET request to the specified URL."""
    try:
        response = requests.get(url, verify=False)
        response.raise_for_status()
        return process_response(response)
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during GET request: {e}")
        return None

def send_sql_query(base_url, query, params=None):
    """Send a SQL query to the API endpoint."""
    try:
        # Construct the full URL for the query endpoint
        url = f"{base_url}/api/query"
        
        # Prepare the request payload
        payload = {
            "query": query,
            "params": params if params else []
        }
        
        # Make the POST request
        response = requests.post(
            url,
            json=payload,
            verify=False,
            headers={'Content-Type': 'application/json'}
        )
        
        response.raise_for_status()
        return process_response(response)
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during POST request: {e}")
        return None

def process_response(response):
    """Process the API response."""
    print(f"\nStatus Code: {response.status_code}")
    
    try:
        json_data = response.json()
        print("Response Content:", json.dumps(json_data, indent=2))
        return json_data
    except ValueError:
        print("Raw Response Content:", response.text)
        return None

def main():
    # Configuration
    base_url = "http://lucasengpiserver.duckdns.org:8000"
    
    # Example queries
    queries = [
        {
            "name": "Get all students",
            "query": "SELECT * FROM students",
            "params": []
        },
        {
            "name": "Get students with high grades",
            "query": "SELECT * FROM students WHERE grade > ?",
            "params": [90]
        },
        {
            "name": "Get student count by grade level",
            "query": "SELECT grade_level, COUNT(*) as student_count FROM students GROUP BY grade_level",
            "params": []
        }
    ]
    
    # Execute each query
    for query_info in queries:
        print(f"\nExecuting: {query_info['name']}")
        print(f"Query: {query_info['query']}")
        print(f"Parameters: {query_info['params']}")
        
        result = send_sql_query(base_url, query_info['query'], query_info['params'])
        
        if result:
            if isinstance(result.get('results'), list):
                print(f"Number of rows returned: {len(result['results'])}")

if __name__ == '__main__':
    main()
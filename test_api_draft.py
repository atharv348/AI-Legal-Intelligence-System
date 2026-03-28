
import requests
import json

url = "http://localhost:8000/api/v1/draft-document"
payload = {
    "description": "I want to file an FIR for a lost mobile phone near Central Railway Station.",
    "doc_type": "FIR",
    "language": "en"
}
headers = {
    "Content-Type": "application/json"
}

print(f"Sending request to {url}...")
try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success!")
        print(response.json())
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")

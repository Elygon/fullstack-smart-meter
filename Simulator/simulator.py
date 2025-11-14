import requests
import time
import random

# Replace with your actual meter ID and server URL
METER_ID = "687201658fd9cf59262127bc"  # Use a real meterId from your database
SERVER_URL = "http://localhost:4500/admin_log/realtime"

while True:
    usage = round(random.uniform(1.5, 4.0), 2)  # Simulate 1.5-4.0 kWh
    payload = {
        "meterId":  METER_ID,
        "energyUsage": usage
    }

    try:
        response = requests.post(SERVER_URL, json=payload)
        print(f"Sent {usage} kWh | Response: {response.status_code} - {response.text}")
        
    except Exception as e:
        print("Error sending data:", e)
        
        time.sleep(10) # Send data every 10 seconds (you can change to 3600 for hourly)
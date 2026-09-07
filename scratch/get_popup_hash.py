import urllib.request
import re

url = "https://greenpreneur.in/assets/index-D-IixBvj.js"
try:
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        
    print("Length of content:", len(content))
    
    # Let's search for "assets/"
    assets = re.findall(r'assets/[\w\-]+\.\w+', content)
    print("Assets matches (first 20):", assets[:20])
    
    # Search for any JPG or JPEG image reference
    jpgs = re.findall(r'[\w\-]+\.jpg|[\w\-]+\.jpeg', content)
    print("JPG/JPEG matches:", jpgs)
    
    # Search for "popup" case-insensitive
    popups = re.findall(r'(?i)\b\w*popup\w*\b', content)
    print("Popup mentions:", popups)
except Exception as e:
    print("Error:", e)

import requests
import os
import json
import time

# Your API key from Pexels
API_KEY = '232scaGdEj7xfUwBDH0L7MpOUWdduBmRnpgl3JtD8DOzwKtourWrud9G'
headers = {'Authorization': API_KEY}

# Expanded list of simple nouns for your word association game (150 words)
keywords = [
    # Original 15
    'ocean', 'flower', 'cow', 'mountain', 'tree', 'sun', 'book', 
    'house', 'dog', 'car', 'bird', 'apple', 'chair', 'shoe', 'rain',
    
    # Nature
    'river', 'lake', 'forest', 'beach', 'cloud', 'snow', 'wind', 'moon', 'star', 'grass',
    'leaf', 'rock', 'desert', 'island', 'waterfall', 'rainbow', 'thunder', 'sunset', 'sunrise', 'sky',
    
    # Animals
    'cat', 'fish', 'horse', 'sheep', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer',
    'rabbit', 'mouse', 'frog', 'snake', 'butterfly', 'bee', 'ant', 'spider', 'elephant', 'monkey',
    
    # Food
    'bread', 'cheese', 'meat', 'rice', 'pasta', 'egg', 'milk', 'water', 'coffee', 'tea',
    'cake', 'pizza', 'soup', 'salad', 'fruit', 'vegetable', 'candy', 'ice cream', 'chocolate', 'honey',
    
    # Household
    'table', 'bed', 'door', 'window', 'lamp', 'clock', 'mirror', 'sofa', 'carpet', 'pillow',
    'blanket', 'curtain', 'plate', 'cup', 'spoon', 'fork', 'knife', 'bowl', 'bottle', 'glass',
    
    # Clothing
    'hat', 'shirt', 'pants', 'dress', 'coat', 'glove', 'sock', 'belt', 'watch', 'ring',
    'necklace', 'scarf', 'sweater', 'jacket', 'suit', 'skirt', 'tie', 'boots', 'sandal', 'umbrella',
    
    # Technology
    'phone', 'computer', 'laptop', 'camera', 'television', 'radio', 'keyboard', 'screen', 'speaker', 'headphone',
    'battery', 'wire', 'robot', 'satellite', 'rocket', 'airplane', 'train', 'bus', 'bicycle', 'motorcycle',
    
    # Places
    'city', 'town', 'village', 'park', 'garden', 'farm', 'school', 'hospital', 'store', 'market',
    'office', 'library', 'museum', 'church', 'castle', 'bridge', 'tower', 'fountain', 'pool', 'stadium',
    
    # Abstract/Others
    'love', 'peace', 'joy', 'hope', 'dream', 'smile', 'art', 'music', 'dance', 'sport'
]

# Define the directory paths
current_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(current_dir, 'images')

# Create directories
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# Initialize JSON database
database = []
id_counter = 1

for keyword in keywords:
    print(f"Processing '{keyword}'...")
    
    # Request images for this keyword
    url = f'https://api.pexels.com/v1/search?query={keyword}&per_page=1'
    
    response = requests.get(url, headers=headers)
    data = response.json()
    
    if 'photos' in data and len(data['photos']) > 0:
        photo = data['photos'][0]  # Get the first image
        image_url = photo['src']['medium']
        
        # Create a simple filename
        filename = f"{keyword.replace(' ', '_')}.jpg"
        filepath = os.path.join(images_dir, filename)
        
        # Download the image
        image_response = requests.get(image_url)
        with open(filepath, 'wb') as f:
            f.write(image_response.content)
        
        # Add entry to database
        entry = {
            "id": id_counter,
            "word": keyword,
            "img": f"/pexels-scrape/images/{filename}",  # Updated path for frontend
            "photographer": photo['photographer'],
            "photographer_url": photo['photographer_url'],
            "pexels_url": photo['url']  # Include original URL for attribution
        }
        
        database.append(entry)
        id_counter += 1
        
        print(f"  Added {keyword} to database with image {filename}")
        
        # Small delay between requests to avoid hitting API rate limits
        time.sleep(0.7)
    else:
        print(f"  No images found for '{keyword}'")

# Save the database as JSON
database_path = os.path.join(current_dir, 'word_database.json')
with open(database_path, 'w') as f:
    json.dump(database, f, indent=2)

print(f"Complete! Created database with {len(database)} words and images.")
print(f"Images saved to: {images_dir}")
print(f"Database saved to: {database_path}") 
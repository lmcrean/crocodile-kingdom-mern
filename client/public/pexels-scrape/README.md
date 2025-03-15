# Pexels Image Scraper

This script downloads images from Pexels API based on keywords and creates a JSON database for use in the frontend.

## Features

- Downloads 150 images from Pexels API
- Images cover various categories: nature, animals, food, household items, clothing, technology, places, and abstract concepts
- Creates a JSON database with metadata for each image
- Properly handles API rate limiting

## Setup

1. Install Python 3.6+ if not already installed
2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

Run the script:
```
python fetch_pexels.py
```

This will:
1. Create an `images` directory if it doesn't exist
2. Download images from Pexels for each of the 150 keywords
3. Save the images in the `images` directory
4. Create a `word_database.json` file with metadata

## Result

The script creates:
- `images/` directory with downloaded images (approximately 150 images)
- `word_database.json` file with the following structure:
  ```json
  [
    {
      "id": 1,
      "word": "keyword",
      "img": "/pexels-scrape/images/keyword.jpg",
      "photographer": "Photographer Name",
      "photographer_url": "https://www.pexels.com/@photographer",
      "pexels_url": "https://www.pexels.com/photo/..."
    },
    ...
  ]
  ```

You can access these images in your frontend using the paths stored in the JSON file.

## Note

The script includes a small delay between API requests to avoid hitting Pexels API rate limits. 
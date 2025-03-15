/**
 * Loads a random set of cards from the word database
 * @param {number} count - Number of cards to load (default: 16)
 * @returns {Promise<Array>} - Array of card objects
 */
export const loadCards = async (count = 16) => {
  try {
    // Fetch the word database
    const response = await fetch('/pexels-scrape/word_database.json');
    if (!response.ok) {
      throw new Error('Failed to fetch word database');
    }
    
    const wordDatabase = await response.json();
    
    // Shuffle the database and take the first 'count' items
    const shuffled = [...wordDatabase].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, count);
    
    // Transform into card objects
    return selectedWords.map(item => ({
      id: `card-${item.id}`,
      word: item.word,
      imagePath: item.img,
      isFlipped: false,
      isMatched: false,
      isSelected: false,
      photographer: item.photographer,
      photographerUrl: item.photographer_url,
      pexelsUrl: item.pexels_url
    }));
  } catch (error) {
    console.error('Error loading cards:', error);
    return [];
  }
};

/**
 * Creates a test set of cards for testing purposes
 * @param {number} count - Number of cards to create (default: 16)
 * @returns {Array} - Array of card objects
 */
export const createTestCards = (count = 16) => {
  const cards = [];
  for (let i = 1; i <= count; i++) {
    cards.push({
      id: `card-${i}`,
      word: `test-word-${i}`,
      imagePath: `/test-image-${i}.jpg`,
      isFlipped: false,
      isMatched: false,
      isSelected: false,
      photographer: 'Test Photographer',
      photographerUrl: 'https://example.com',
      pexelsUrl: 'https://example.com'
    });
  }
  return cards;
}; 
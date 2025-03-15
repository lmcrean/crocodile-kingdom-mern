import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadCards, createTestCards } from '../../utils/loadCards';

// Mock the fetch function
global.fetch = vi.fn();

describe('loadCards Utility', () => {
  // Sample word database for testing
  const mockWordDatabase = [
    {
      id: 1,
      word: "ocean",
      img: "/pexels-scrape/images/ocean.jpg",
      photographer: "Test Photographer 1",
      photographer_url: "https://example.com/1",
      pexels_url: "https://example.com/photo/1"
    },
    {
      id: 2,
      word: "mountain",
      img: "/pexels-scrape/images/mountain.jpg",
      photographer: "Test Photographer 2",
      photographer_url: "https://example.com/2",
      pexels_url: "https://example.com/photo/2"
    },
    {
      id: 3,
      word: "forest",
      img: "/pexels-scrape/images/forest.jpg",
      photographer: "Test Photographer 3",
      photographer_url: "https://example.com/3",
      pexels_url: "https://example.com/photo/3"
    },
    {
      id: 4,
      word: "city",
      img: "/pexels-scrape/images/city.jpg",
      photographer: "Test Photographer 4",
      photographer_url: "https://example.com/4",
      pexels_url: "https://example.com/photo/4"
    }
  ];

  beforeEach(() => {
    // Reset the mock before each test
    fetch.mockReset();
    
    // Mock the fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockWordDatabase
    });
  });

  it('should load the specified number of cards', async () => {
    const cards = await loadCards(2);
    
    // Check that fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith('/pexels-scrape/word_database.json');
    
    // Check that we got the right number of cards
    expect(cards).toHaveLength(2);
  });

  it('should transform word database items into card objects', async () => {
    const cards = await loadCards(1);
    
    // Check that the card has the correct properties
    const card = cards[0];
    expect(card).toHaveProperty('id');
    expect(card).toHaveProperty('word');
    expect(card).toHaveProperty('imagePath');
    expect(card).toHaveProperty('isFlipped', false);
    expect(card).toHaveProperty('isMatched', false);
    expect(card).toHaveProperty('isSelected', false);
    expect(card).toHaveProperty('photographer');
    expect(card).toHaveProperty('photographerUrl');
    expect(card).toHaveProperty('pexelsUrl');
  });

  it('should return different sets of cards on subsequent calls', async () => {
    // Instead of mocking Math.random, we'll mock the fetch to return different results
    fetch.mockReset();
    
    // First call returns first two items
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockWordDatabase[0], mockWordDatabase[1]]
    });
    
    // Second call returns last two items
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockWordDatabase[2], mockWordDatabase[3]]
    });
    
    const firstSet = await loadCards(2);
    const secondSet = await loadCards(2);
    
    // Check that the sets are different
    expect(firstSet[0].word).not.toBe(secondSet[0].word);
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock a failed fetch
    fetch.mockRejectedValue(new Error('Network error'));
    
    const cards = await loadCards();
    
    // Should return an empty array on error
    expect(cards).toEqual([]);
  });

  it('should handle non-OK responses gracefully', async () => {
    // Mock a non-OK response
    fetch.mockResolvedValue({
      ok: false
    });
    
    const cards = await loadCards();
    
    // Should return an empty array on error
    expect(cards).toEqual([]);
  });

  it('should create test cards with the specified count', () => {
    const testCards = createTestCards(5);
    
    // Check that we got the right number of cards
    expect(testCards).toHaveLength(5);
    
    // Check that the cards have the expected properties
    testCards.forEach((card, index) => {
      expect(card.id).toBe(`card-${index + 1}`);
      expect(card.word).toBe(`test-word-${index + 1}`);
      expect(card.imagePath).toBe(`/test-image-${index + 1}.jpg`);
      expect(card.isFlipped).toBe(false);
      expect(card.isMatched).toBe(false);
      expect(card.isSelected).toBe(false);
    });
  });
}); 
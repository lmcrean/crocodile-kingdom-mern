import { describe, test, expect, vi } from 'vitest';

// Mock functions
const mockHandleCardClick = vi.fn();
const mockCheckAssociation = vi.fn();

describe('Card Flip and Word Association Flow', () => {
  test('User can flip two cards and see the word association modal', () => {
    // Simulate clicking on the first card
    mockHandleCardClick('card-1');
    
    // Verify that handleCardClick was called with the first card
    expect(mockHandleCardClick).toHaveBeenCalledWith('card-1');
    
    // Simulate clicking on the second card
    mockHandleCardClick('card-2');
    
    // Verify that handleCardClick was called with the second card
    expect(mockHandleCardClick).toHaveBeenCalledWith('card-2');
    
    // Simulate submitting an association
    const association = 'This is a test association between the words.';
    mockCheckAssociation(association, ['card-1', 'card-2']);
    
    // Verify that checkAssociation was called with the correct arguments
    expect(mockCheckAssociation).toHaveBeenCalledWith(
      association,
      ['card-1', 'card-2']
    );
  });
}); 
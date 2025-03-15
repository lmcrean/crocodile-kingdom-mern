import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '@/components/game/Card';

describe('Card Component for Word Association Game', () => {
  it('renders a card with the correct content', () => {
    render(
      <Card 
        word="ocean" 
        imagePath="/pexels-scrape/images/ocean.jpg"
        isFlipped={false}
        isSelected={false}
        onClick={() => {}}
      />
    );

    // When not flipped, should show back of card
    expect(screen.getByTestId('card-back')).toHaveClass('scale-100');
    expect(screen.getByText('Word Association')).toBeInTheDocument();
    expect(screen.getByText('Click to reveal')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    
    render(
      <Card 
        word="ocean" 
        imagePath="/pexels-scrape/images/ocean.jpg"
        isFlipped={false}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
    
    fireEvent.click(screen.getByTestId('card'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
}); 
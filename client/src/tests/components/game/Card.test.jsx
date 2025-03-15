import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '@/components/game/Card';

describe('Card Component for Word Association Game', () => {
  it('renders with word and image', () => {
    render(
      <Card 
        word="ocean" 
        imagePath="/pexels-scrape/images/ocean.jpg"
        isFlipped={false}
        isSelected={false}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('ocean')).toBeInTheDocument();
    expect(screen.getByAltText('ocean')).toBeInTheDocument();
    expect(screen.getByAltText('ocean')).toHaveAttribute('src', '/pexels-scrape/images/ocean.jpg');
  });

  it('applies selected styles when card is selected', () => {
    render(
      <Card 
        word="ocean" 
        imagePath="/pexels-scrape/images/ocean.jpg"
        isFlipped={false}
        isSelected={true}
        onClick={() => {}}
      />
    );

    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveClass('border-4');
    expect(cardElement).toHaveClass('border-green-500');
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

  it('shows full-sized card when flipped', () => {
    render(
      <Card 
        word="ocean" 
        imagePath="/pexels-scrape/images/ocean.jpg"
        isFlipped={true}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const cardElement = screen.getByTestId('card-front');
    expect(cardElement).toHaveClass('z-10');
    expect(cardElement).toHaveClass('scale-100');
  });
}); 
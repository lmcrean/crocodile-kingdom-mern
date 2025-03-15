import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../../components/game/Card';

describe('Card Component', () => {
  const defaultProps = {
    word: 'ocean',
    imagePath: '/pexels-scrape/images/ocean.jpg',
    isFlipped: false,
    isSelected: false,
    onClick: vi.fn()
  };

  it('renders the back of the card when not flipped', () => {
    render(<Card {...defaultProps} />);
    
    // Back of card should be visible
    const backElement = screen.getByTestId('card-back');
    expect(backElement.className).toContain('scale-100');
    
    // Should show the default back text
    expect(screen.getByText('Word Association')).toBeInTheDocument();
    expect(screen.getByText('Click to reveal')).toBeInTheDocument();
  });

  it('renders the front of the card when flipped', () => {
    render(<Card {...defaultProps} isFlipped={true} />);
    
    // Front of card should be visible
    const frontElement = screen.getByTestId('card-front');
    expect(frontElement.className).toContain('scale-100');
    
    // Should show the word
    expect(screen.getByText('ocean')).toBeInTheDocument();
    
    // Should show the image
    const imgElement = screen.getByAltText('ocean');
    expect(imgElement).toHaveAttribute('src', '/pexels-scrape/images/ocean.jpg');
  });

  it('applies selected styling when card is selected', () => {
    render(<Card {...defaultProps} isSelected={true} />);
    
    // Card should have selected styling
    const cardElement = screen.getByTestId('card');
    expect(cardElement.className).toContain('border-4');
    expect(cardElement.className).toContain('border-green-500');
  });

  it('calls onClick handler when clicked', () => {
    render(<Card {...defaultProps} />);
    
    // Click the card
    const cardElement = screen.getByTestId('card');
    cardElement.click();
    
    // onClick should have been called
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
}); 
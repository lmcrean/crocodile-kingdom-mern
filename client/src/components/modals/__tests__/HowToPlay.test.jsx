import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HowToPlayModal from '../HowToPlay';
import { vi } from 'vitest';

describe('HowToPlayModal', () => {
  const mockClose = vi.fn();

  const renderModal = (props = {}) => {
    return render(
      <HowToPlayModal
        isOpen={true}
        onClose={mockClose}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly when open', () => {
    renderModal();
    
    expect(screen.getByTestId('how-to-play-modal')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
    expect(screen.getByText('Match cards by creating word associations')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderModal({ isOpen: false });
    
    expect(screen.queryByTestId('how-to-play-modal')).not.toBeInTheDocument();
  });

  test('closes when close button is clicked', () => {
    renderModal();
    
    const closeButton = screen.getByText('Got it!');
    fireEvent.click(closeButton);
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('displays step-by-step instructions', () => {
    renderModal();
    
    // Check for specific instruction steps
    expect(screen.getByText('1. Flip a card')).toBeInTheDocument();
    expect(screen.getByText('2. Flip another card')).toBeInTheDocument();
    expect(screen.getByText('3. Create a word association')).toBeInTheDocument();
    expect(screen.getByText('4. Match all pairs to win')).toBeInTheDocument();
  });
}); 
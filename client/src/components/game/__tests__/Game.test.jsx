import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Game from '../Game';

// Mock the GameContext
vi.mock('../../../context/GameContext', () => ({
  useGameContext: () => ({
    cards: [
      { id: 'card-1', word: 'apple', imagePath: '/test/apple.jpg', isFlipped: false, isMatched: false },
      { id: 'card-2', word: 'banana', imagePath: '/test/banana.jpg', isFlipped: false, isMatched: false }
    ],
    matchedPairs: [],
    flippedCards: [],
    dispatch: vi.fn()
  })
}));

// Mock the useGameLogic hook
vi.mock('../../../hooks/useGameLogic', () => ({
  useGameLogic: () => ({
    handleCardClick: vi.fn(),
    resetGame: vi.fn(),
    initializeGame: vi.fn(),
    isLoading: false,
    error: null,
    checkAssociation: vi.fn()
  })
}));

// Mock the HowToPlay modal
vi.mock('../../modals/HowToPlay', () => ({
  default: ({ isOpen, onClose }) => 
    isOpen ? (
      <div data-testid="mocked-how-to-play-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}));

// Mock the WordAssociation modal
vi.mock('../../modals/WordAssociation', () => ({
  default: ({ isOpen }) => 
    isOpen ? <div data-testid="mocked-association-modal" /> : null
}));

describe('Game Component', () => {
  test('renders without crashing', () => {
    render(<Game />);
    expect(screen.getByText('Matches:')).toBeInTheDocument();
    expect(screen.getByText('0 / 1')).toBeInTheDocument();
  });

  test('does not display the Turns Left ticker', () => {
    render(<Game />);
    expect(screen.queryByText('Turns Left:')).not.toBeInTheDocument();
  });

  test('does not display the Debug button', () => {
    render(<Game />);
    expect(screen.queryByText('Debug ON')).not.toBeInTheDocument();
    expect(screen.queryByText('Debug OFF')).not.toBeInTheDocument();
  });

  test('shows How To Play modal when button is clicked', () => {
    render(<Game />);
    
    // Initially, modal should not be visible
    expect(screen.queryByTestId('mocked-how-to-play-modal')).not.toBeInTheDocument();
    
    // Click the button
    fireEvent.click(screen.getByText('How to Play'));
    
    // Modal should now be visible
    expect(screen.getByTestId('mocked-how-to-play-modal')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByText('Close'));
    
    // Modal should be hidden again
    expect(screen.queryByTestId('mocked-how-to-play-modal')).not.toBeInTheDocument();
  });
}); 
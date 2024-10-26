// src/hooks/useGameLogic.jsx
import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';

export const useGameLogic = () => {
  const { 
    cards, 
    flippedCards, 
    matchedPairs, 
    isChecking,
    dispatch 
  } = useGameContext();

  const shuffleCards = useCallback(() => {
    const cardTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cardPairs = cardTypes.flatMap(type => [
      { id: `${type}-1`, type, isFlipped: false, isMatched: false },
      { id: `${type}-2`, type, isFlipped: false, isMatched: false }
    ]);

    // Fisher-Yates shuffle
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    return cardPairs;
  }, []);

  const initializeGame = useCallback(() => {
    const shuffledCards = shuffleCards();
    dispatch({ type: 'INITIALIZE_CARDS', payload: shuffledCards });
  }, [dispatch, shuffleCards]);

  const handleCardClick = useCallback((cardId) => {
    const cardToFlip = cards.find(card => card.id === cardId);
    
    // Prevent invalid moves
    if (
      isChecking || 
      cardToFlip.isMatched || 
      cardToFlip.isFlipped || 
      flippedCards.length === 2
    ) {
      return;
    }

    // Flip the card
    dispatch({ type: 'FLIP_CARD', payload: cardId });

    // If this is the second card
    if (flippedCards.length === 1) {
      const firstCard = cards.find(card => card.id === flippedCards[0]);
      
      // Check for match
      if (firstCard.type === cardToFlip.type) {
        dispatch({ type: 'SET_MATCHED_PAIR', payload: cardToFlip.type });
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          dispatch({ type: 'RESET_FLIPPED_CARDS' });
        }, 1000);
      }
      
      dispatch({ type: 'INCREMENT_TURNS' });
    }
  }, [cards, flippedCards, isChecking, dispatch]);

  const resetGame = useCallback(() => {
    const shuffledCards = shuffleCards();
    dispatch({ type: 'RESET_GAME', payload: shuffledCards });
  }, [dispatch, shuffleCards]);

  return {
    cards,
    matchedPairs,
    handleCardClick,
    resetGame,
    initializeGame
  };
};
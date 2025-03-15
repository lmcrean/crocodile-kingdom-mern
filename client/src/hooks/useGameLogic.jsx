// src/hooks/useGameLogic.jsx
import { useCallback, useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { validateAssociation } from '../utils/wordAssociation';
import { loadCards } from '../utils/loadCards';

export const useGameLogic = () => {
  const { 
    cards, 
    flippedCards, 
    matchedPairs, 
    isChecking,
    dispatch 
  } = useGameContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize game by loading cards from the word database
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomCards = await loadCards(16);
      if (randomCards.length === 0) {
        throw new Error('Failed to load cards');
      }
      
      dispatch({ type: 'INITIALIZE_CARDS', payload: randomCards });
    } catch (err) {
      console.error('Error initializing game:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Handle card click to flip/select
  const handleCardClick = useCallback((cardId) => {
    const cardToFlip = cards.find(card => card.id === cardId);
    
    // Prevent invalid moves
    if (isChecking || cardToFlip.isMatched || cardToFlip.isFlipped) {
      return;
    }

    // Flip the card
    dispatch({ type: 'FLIP_CARD', payload: cardId });
    
    // If we have two cards flipped, we'll need to enter an association
    // This will be handled by the Game component with modal
  }, [cards, isChecking, dispatch]);

  // Handle selecting a card for association
  const selectCard = useCallback((cardId) => {
    dispatch({ type: 'SELECT_CARD', payload: cardId });
  }, [dispatch]);

  // Check if word association is valid
  const checkAssociation = useCallback((association, selectedCardIds) => {
    if (selectedCardIds.length !== 2) return false;
    
    const card1 = cards.find(card => card.id === selectedCardIds[0]);
    const card2 = cards.find(card => card.id === selectedCardIds[1]);
    
    if (!card1 || !card2) return false;
    
    // Use the validation utility
    const isValid = validateAssociation(association, card1.word, card2.word);
    
    if (isValid) {
      // Set as matched if valid
      dispatch({ type: 'SET_MATCHED_PAIR', payload: [card1.id, card2.id] });
      return true;
    } else {
      // Reset selection if invalid
      dispatch({ type: 'RESET_SELECTED_CARDS' });
      return false;
    }
  }, [cards, dispatch]);

  const resetGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomCards = await loadCards(16);
      if (randomCards.length === 0) {
        throw new Error('Failed to load cards');
      }
      
      dispatch({ type: 'RESET_GAME', payload: randomCards });
    } catch (err) {
      console.error('Error resetting game:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return {
    cards,
    matchedPairs,
    isLoading,
    error,
    handleCardClick,
    selectCard,
    checkAssociation,
    resetGame,
    initializeGame
  };
};
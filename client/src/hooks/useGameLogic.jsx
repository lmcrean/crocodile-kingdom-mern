// src/hooks/useGameLogic.jsx
import { useCallback, useState, useEffect, useRef } from 'react';
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
    if (isChecking || !cardToFlip || cardToFlip.isMatched || cardToFlip.isFlipped) {
      return;
    }

    // No longer reset flipped cards when 2 are already flipped
    // This allows cards to stay flipped after modal interaction

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
    console.log('[GAME_LOGIC] checkAssociation called with:', { association, selectedCardIds });
    
    if (selectedCardIds.length !== 2) {
      console.log('[GAME_LOGIC] Invalid number of cards:', selectedCardIds.length);
      return false;
    }
    
    const card1 = cards.find(card => card.id === selectedCardIds[0]);
    const card2 = cards.find(card => card.id === selectedCardIds[1]);
    
    if (!card1 || !card2) {
      console.log('[GAME_LOGIC] Could not find cards:', { card1, card2 });
      return false;
    }
    
    // Log card states before validation
    console.log('[GAME_LOGIC] Card states before validation:');
    console.log(`  Card ${card1.id}: isFlipped=${card1.isFlipped}, isMatched=${card1.isMatched}`);
    console.log(`  Card ${card2.id}: isFlipped=${card2.isFlipped}, isMatched=${card2.isMatched}`);
    console.log('[GAME_LOGIC] Current flippedCards:', flippedCards);
    
    // Use the validation utility
    const isValid = validateAssociation(association, card1.word, card2.word);
    console.log('[GAME_LOGIC] Association validation result:', isValid);
    
    if (isValid) {
      console.log('[GAME_LOGIC] Valid association, setting matched pair');
      // Set as matched if valid
      dispatch({ type: 'SET_MATCHED_PAIR', payload: [card1.id, card2.id] });
      
      // Log again after setting matched
      setTimeout(() => {
        const updatedCards = cards.filter(c => c.id === card1.id || c.id === card2.id);
        console.log('[GAME_LOGIC] Card states after SET_MATCHED_PAIR:');
        updatedCards.forEach(card => {
          console.log(`  Card ${card.id}: isFlipped=${card.isFlipped}, isMatched=${card.isMatched}`);
        });
      }, 0);
      
      // Clear flipped cards array without flipping the cards back
      console.log('[GAME_LOGIC] Clearing flippedCards array');
      dispatch({ type: 'CLEAR_FLIPPED_CARDS' });
      return true;
    } else {
      console.log('[GAME_LOGIC] Invalid association, resetting cards');
      // Reset selection if invalid
      dispatch({ type: 'RESET_SELECTED_CARDS' });
      // For invalid associations, we still want to reset flipped cards
      // so player can try again
      dispatch({ type: 'RESET_FLIPPED_CARDS' });
      return false;
    }
  }, [cards, dispatch, flippedCards]);

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
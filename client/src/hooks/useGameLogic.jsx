import { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';

export const useGameLogic = () => {
  const { state, dispatch } = useGameContext();

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initializeGame = () => {
    const cardTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cardPairs = cardTypes.flatMap(type => [
      { id: `${type}-1`, type, isFlipped: false, isMatched: false },
      { id: `${type}-2`, type, isFlipped: false, isMatched: false }
    ]);
    
    dispatch({ 
      type: 'INITIALIZE_CARDS', 
      payload: shuffleArray([...cardPairs])
    });
  };

  const handleCardClick = (clickedId) => {
    const { cards, flippedIndexes, isChecking } = state;
    
    // Prevent invalid moves
    if (
      isChecking ||
      cards.find(card => card.id === clickedId).isMatched ||
      cards.find(card => card.id === clickedId).isFlipped ||
      flippedIndexes.length === 2
    ) {
      return;
    }

    dispatch({ type: 'FLIP_CARD', payload: clickedId });
  };

  const resetGame = () => {
    const resetCards = shuffleArray([...state.cards])
      .map(card => ({
        ...card,
        isFlipped: false,
        isMatched: false
      }));
    
    dispatch({ type: 'RESET_GAME', payload: resetCards });
  };

  // Check for matches
  useEffect(() => {
    if (state.flippedIndexes.length === 2) {
      const [firstId, secondId] = state.flippedIndexes;
      const firstCard = state.cards.find(card => card.id === firstId);
      const secondCard = state.cards.find(card => card.id === secondId);

      if (firstCard.type === secondCard.type) {
        // Match found
        dispatch({ type: 'SET_MATCHED_PAIRS', payload: firstCard.type });
      } else {
        // No match
        dispatch({ type: 'SET_CHECKING', payload: true });
        setTimeout(() => {
          dispatch({ type: 'RESET_FLIPPED_CARDS' });
          dispatch({ type: 'SET_CHECKING', payload: false });
        }, 1000);
      }
    }
  }, [state.flippedIndexes]);

  return {
    cards: state.cards,
    matchedPairs: state.matchedPairs,
    handleCardClick,
    resetGame,
    initializeGame
  };
};

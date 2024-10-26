import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  cards: [],
  flippedIndexes: [],
  matchedPairs: [],
  isChecking: false,
  turns: 0
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_CARDS':
      return {
        ...state,
        cards: action.payload
      };
    case 'FLIP_CARD':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload
            ? { ...card, isFlipped: true }
            : card
        ),
        flippedIndexes: [...state.flippedIndexes, action.payload]
      };
    case 'SET_MATCHED_PAIRS':
      return {
        ...state,
        matchedPairs: [...state.matchedPairs, action.payload],
        cards: state.cards.map(card =>
          card.type === action.payload
            ? { ...card, isMatched: true }
            : card
        ),
        flippedIndexes: []
      };
    case 'RESET_FLIPPED_CARDS':
      return {
        ...state,
        cards: state.cards.map(card =>
          state.flippedIndexes.includes(card.id)
            ? { ...card, isFlipped: false }
            : card
        ),
        flippedIndexes: []
      };
    case 'SET_CHECKING':
      return {
        ...state,
        isChecking: action.payload
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        cards: action.payload
      };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
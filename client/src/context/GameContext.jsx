// src/context/GameContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Define initial state with all game properties
const initialState = {
  // Card related state
  cards: [],
  flippedCards: [],
  selectedCards: [],
  matchedPairs: [],
  isChecking: false,
  currentAssociation: '',

  // Game progress
  turns: 0,
  turnsLeft: 40,
  maxTurns: 40,
  gameStarted: false,
  gameOver: false,
  gameWon: false,

  // Audio state
  soundEnabled: true,
  musicEnabled: true,

  // High scores
  highScores: [],
  currentScore: 0,
};

// Define all possible action types
const ActionTypes = {
  // Card actions
  INITIALIZE_CARDS: 'INITIALIZE_CARDS',
  FLIP_CARD: 'FLIP_CARD',
  SELECT_CARD: 'SELECT_CARD',
  RESET_FLIPPED_CARDS: 'RESET_FLIPPED_CARDS',
  RESET_SELECTED_CARDS: 'RESET_SELECTED_CARDS',
  SET_MATCHED_PAIR: 'SET_MATCHED_PAIR',
  SET_CHECKING: 'SET_CHECKING',
  SET_ASSOCIATION: 'SET_ASSOCIATION',

  // Game progress actions
  START_GAME: 'START_GAME',
  END_GAME: 'END_GAME',
  RESET_GAME: 'RESET_GAME',
  INCREMENT_TURNS: 'INCREMENT_TURNS',
  DECREASE_TURNS_LEFT: 'DECREASE_TURNS_LEFT',

  // Audio actions
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',

  // Score actions
  UPDATE_SCORE: 'UPDATE_SCORE',
  ADD_HIGH_SCORE: 'ADD_HIGH_SCORE',
};

// Game reducer with all possible state updates
function gameReducer(state, action) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_CARDS:
      return {
        ...state,
        cards: action.payload,
        flippedCards: [],
        selectedCards: [],
        matchedPairs: [],
        turns: 0,
        turnsLeft: state.maxTurns,
        gameOver: false,
        gameWon: false,
        gameStarted: true,
        currentScore: 0,
        currentAssociation: '',
      };

    case ActionTypes.FLIP_CARD:
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload
            ? { ...card, isFlipped: true }
            : card
        ),
        flippedCards: [...state.flippedCards, action.payload]
      };

    case ActionTypes.SELECT_CARD:
      // Only allow selecting up to 2 cards
      if (state.selectedCards.includes(action.payload)) {
        // Deselect if already selected
        return {
          ...state,
          selectedCards: state.selectedCards.filter(id => id !== action.payload),
          cards: state.cards.map(card =>
            card.id === action.payload
              ? { ...card, isSelected: false }
              : card
          )
        };
      } else if (state.selectedCards.length < 2) {
        // Select new card
        return {
          ...state,
          selectedCards: [...state.selectedCards, action.payload],
          cards: state.cards.map(card =>
            card.id === action.payload
              ? { ...card, isSelected: true }
              : card
          )
        };
      }
      return state;

    case ActionTypes.RESET_FLIPPED_CARDS:
      return {
        ...state,
        cards: state.cards.map(card =>
          state.flippedCards.includes(card.id)
            ? { ...card, isFlipped: false }
            : card
        ),
        flippedCards: []
      };

    case ActionTypes.RESET_SELECTED_CARDS:
      return {
        ...state,
        cards: state.cards.map(card =>
          state.selectedCards.includes(card.id)
            ? { ...card, isSelected: false }
            : card
        ),
        selectedCards: [],
        currentAssociation: ''
      };

    case ActionTypes.SET_MATCHED_PAIR:
      const matchedCardIds = action.payload;
      const newMatchedPairs = [...state.matchedPairs, ...matchedCardIds];
      const totalPairsInGame = state.cards.length / 2;
      const isGameWon = newMatchedPairs.length === state.cards.length; // All cards matched
      
      return {
        ...state,
        matchedPairs: newMatchedPairs,
        gameWon: isGameWon,
        gameOver: isGameWon,
        currentScore: state.currentScore + (state.turnsLeft * 50), // Increment score
        cards: state.cards.map(card =>
          matchedCardIds.includes(card.id)
            ? { ...card, isMatched: true, isSelected: false }
            : card
        ),
        selectedCards: [],
        flippedCards: [],
        currentAssociation: '',
      };

    case ActionTypes.SET_CHECKING:
      return {
        ...state,
        isChecking: action.payload
      };

    case ActionTypes.SET_ASSOCIATION:
      return {
        ...state,
        currentAssociation: action.payload
      };

    case ActionTypes.START_GAME:
      return {
        ...state,
        gameStarted: true,
        gameOver: false,
        gameWon: false
      };

    case ActionTypes.END_GAME:
      return {
        ...state,
        gameOver: true,
        gameWon: action.payload
      };

    case ActionTypes.INCREMENT_TURNS:
      return {
        ...state,
        turns: state.turns + 1,
        turnsLeft: state.turnsLeft - 1,
        gameOver: state.turnsLeft <= 1 && !state.gameWon
      };

    case ActionTypes.TOGGLE_SOUND:
      return {
        ...state,
        soundEnabled: !state.soundEnabled
      };

    case ActionTypes.TOGGLE_MUSIC:
      return {
        ...state,
        musicEnabled: !state.musicEnabled
      };

    case ActionTypes.UPDATE_SCORE:
      return {
        ...state,
        currentScore: action.payload
      };

    case ActionTypes.ADD_HIGH_SCORE:
      const newHighScores = [
        ...state.highScores,
        { name: action.payload.name, score: action.payload.score }
      ].sort((a, b) => b.score - a.score).slice(0, 10); // Keep top 10 scores

      return {
        ...state,
        highScores: newHighScores
      };

    case ActionTypes.RESET_GAME:
      return {
        ...initialState,
        cards: action.payload,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        highScores: state.highScores
      };

    default:
      return state;
  }
}

// Create the context
const GameContext = createContext(undefined);

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Create value object with all state and dispatch
  const value = {
    // Game state
    cards: state.cards,
    flippedCards: state.flippedCards,
    selectedCards: state.selectedCards,
    matchedPairs: state.matchedPairs,
    isChecking: state.isChecking,
    currentAssociation: state.currentAssociation,
    
    // Game progress
    turns: state.turns,
    turnsLeft: state.turnsLeft,
    maxTurns: state.maxTurns,
    gameStarted: state.gameStarted,
    gameOver: state.gameOver,
    gameWon: state.gameWon,
    
    // Audio state
    soundEnabled: state.soundEnabled,
    musicEnabled: state.musicEnabled,
    
    // Scores
    currentScore: state.currentScore,
    highScores: state.highScores,

    // Actions dispatcher
    dispatch,

    // Helper methods
    toggleSound: () => dispatch({ type: ActionTypes.TOGGLE_SOUND }),
    toggleMusic: () => dispatch({ type: ActionTypes.TOGGLE_MUSIC }),
    resetGame: (cards) => dispatch({ type: ActionTypes.RESET_GAME, payload: cards }),
    setAssociation: (text) => dispatch({ type: ActionTypes.SET_ASSOCIATION, payload: text }),
    resetSelectedCards: () => dispatch({ type: ActionTypes.RESET_SELECTED_CARDS }),
    addHighScore: (name, score) => dispatch({ 
      type: ActionTypes.ADD_HIGH_SCORE, 
      payload: { name, score } 
    }),
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

// Export context, provider, and hook
export default GameContext;

// Export action types for use in components
export { ActionTypes };
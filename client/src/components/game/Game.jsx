// src/components/game/Game.jsx
import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import Card from './Card';

export default function Game() {
  const { 
    cards, 
    matchedPairs, 
    turnsLeft 
  } = useGameContext();

  const {
    handleCardClick,
    resetGame,
    initializeGame
  } = useGameLogic();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="w-full mx-auto">
      {/* Game Status */}
      <div className="text-center mb-6 lg:text-left">
        <p className="text-white text-lg font-bold mb-2">
          Matches Found: {matchedPairs.length} / 8
        </p>
        <p className="text-white text-lg font-bold">
          Turns Left: {turnsLeft}
        </p>
      </div>

      {/* Game Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-green-700 text-white rounded-full 
                   hover:bg-green-800 transition-colors shadow-lg
                   w-full sm:w-auto"
        >
          Restart Game
        </button>
        <button
          className="px-6 py-2 bg-green-700 text-white rounded-full 
                   hover:bg-green-800 transition-colors shadow-lg
                   w-full sm:w-auto"
        >
          How to Play
        </button>
      </div>

      {/* Card Grid - Responsive sizing */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 
                    aspect-square w-full 
                    xs:max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] 
                    lg:max-w-none mx-auto">
        {cards.map(card => (
          <Card 
            key={card.id}
            {...card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
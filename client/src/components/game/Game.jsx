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
    <div className="w-full">
      {/* Controls and Status Section */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Left side - Status */}
        <div className="flex items-center gap-6 text-white text-lg font-bold order-2 sm:order-1">
          <div className="flex items-center gap-2">
            <span>Matches Found:</span>
            <span>{matchedPairs.length} / 8</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Turns Left:</span>
            <span>{turnsLeft}</span>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex gap-4 order-1 sm:order-2">
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-green-700 text-white rounded-full 
                     hover:bg-green-800 transition-colors shadow-lg
                     whitespace-nowrap"
          >
            Restart Game
          </button>
          <button
            className="px-6 py-2 bg-green-700 text-white rounded-full 
                     hover:bg-green-800 transition-colors shadow-lg
                     whitespace-nowrap"
          >
            How to Play
          </button>
        </div>
      </div>

      {/* Game Grid */}
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
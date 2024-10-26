import React, { useEffect } from 'react';
import Card from './Card';
import { useGameLogic } from '../../hooks/useGameLogic';

export default function Game() {
  const { cards, matchedPairs, handleCardClick, resetGame, initializeGame } = useGameLogic();

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      <img 
        src="/src/assets/media/background-imagery/tropical-jungle.svg" 
        alt="Jungle background"
        className="fixed inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 p-4">
        <div className="text-center mb-4">
          <p className="text-white text-lg font-bold">
            Matches Found: {matchedPairs.length} / 8
          </p>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-harmonious-bold text-white rounded-lg"
          >
            Restart Game
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 w-[90vw] h-[90vw] max-w-[40em] max-h-[40em] mx-auto">
          {cards.map(card => (
            <Card 
              key={card.id}
              {...card}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

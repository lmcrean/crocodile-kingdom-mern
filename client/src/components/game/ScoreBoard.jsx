import React from 'react';
import { useGameContext } from '@/context/GameContext';

export default function ScoreBoard() {
  const { turns, turnsLeft, maxTurns } = useGameContext();
  const progressPercentage = (turnsLeft / maxTurns) * 100;

  return (
    <section className="w-full max-w-md mx-auto p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">
          Turns left: {turnsLeft}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-pink-400 rounded-full overflow-hidden shadow-lg">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-800 to-green-600 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={turnsLeft}
          aria-valuemin={0}
          aria-valuemax={maxTurns}
        />
      </div>

      {/* Hidden Turns Counter (used for final score) */}
      <div className="sr-only">
        Total turns taken: {turns}
      </div>
    </section>
  );
}
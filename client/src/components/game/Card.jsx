// src/components/game/Card.jsx
import React from 'react';

export default function Card({ word, imagePath, isFlipped, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      data-testid="card"
      className={`
        relative h-full w-full rounded-xl shadow-lg cursor-pointer
        transition-all duration-300 transform 
        ${isSelected ? 'border-4 border-green-500' : 'border border-gray-200'}
      `}
    >
      {/* Back of card (shows first) */}
      <div 
        className={`
          absolute inset-0 rounded-xl bg-white overflow-hidden
          transition-all duration-500 z-${isFlipped ? '0' : '10'} scale-${isFlipped ? '0' : '100'}
        `}
        data-testid="card-back"
      >
        <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-blue-50">
          <div className="text-2xl font-bold text-blue-800">Word Association</div>
          <div className="text-sm text-blue-600">Click to reveal</div>
        </div>
      </div>

      {/* Front of card (shows when flipped) */}
      <div 
        className={`
          absolute inset-0 rounded-xl overflow-hidden bg-white
          transition-all duration-500 z-${isFlipped ? '10' : '0'} scale-${isFlipped ? '100' : '0'}
        `}
        data-testid="card-front"
      >
        <div className="h-3/4 w-full overflow-hidden">
          <img
            src={imagePath}
            alt={word}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="h-1/4 w-full flex items-center justify-center bg-white">
          <span className="text-lg font-bold text-gray-800">{word}</span>
        </div>
      </div>
    </div>
  );
}
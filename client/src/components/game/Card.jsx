import React, { useEffect, useRef } from 'react';

export default function Card({ word, imagePath, isFlipped, isMatched, isSelected, onClick, id }) {
  // Consider a card flipped if either isFlipped OR isMatched is true
  const showFlipped = isFlipped || isMatched;
  
  // Keep track of previous state for comparison
  const prevFlippedRef = useRef(isFlipped);
  const prevMatchedRef = useRef(isMatched);
  
  // Enhanced debug logging
  useEffect(() => {
    // Log when a card becomes matched
    if (isMatched && !prevMatchedRef.current) {
      console.log(`Card ${id} is now MATCHED: ${isMatched}`);
    }
    
    // Log when a card is flipped face-up
    if (isFlipped && !prevFlippedRef.current) {
      console.log(`Card ${id} is FLIPPED to face-up: ${isFlipped}`);
    }
    
    // Log when a card is flipped back to face-down
    if (!isFlipped && prevFlippedRef.current) {
      console.log(`WARNING: Card ${id} was FLIPPED BACK to face-down from ${prevFlippedRef.current} to ${isFlipped}`);
      
      // If this card is matched but got flipped down, that's a bug
      if (isMatched) {
        console.error(`BUG: Card ${id} is matched (${isMatched}) but was flipped back down!`);
      }
    }
    
    // Update refs for next render
    prevFlippedRef.current = isFlipped;
    prevMatchedRef.current = isMatched;
  }, [id, isFlipped, isMatched]);
  
  return (
    <div 
      onClick={onClick}
      data-testid="card"
      data-card-id={id}
      data-is-flipped={isFlipped}
      data-is-matched={isMatched}
      className={`
        relative h-full w-full rounded-xl shadow-lg cursor-pointer
        transition-all duration-300 transform 
        ${isSelected ? 'border-4 border-green-500' : isMatched ? 'border-4 border-blue-500' : 'border border-gray-200'}
      `}
    >
      {/* Back of card (shows first) */}
      <div 
        className={`
          absolute inset-0 rounded-xl bg-white overflow-hidden
          transition-all duration-500 z-${showFlipped ? '0' : '10'} scale-${showFlipped ? '0' : '100'}
        `}
        data-testid="card-back"
      >
        <img 
          src="/assets/media/card-deck/back.svg"
          alt="Card back"
          className="h-full w-full object-cover"
          data-testid="card-back-image"
        />
      </div>

      {/* Front of card (shows when flipped) */}
      <div 
        className={`
          absolute inset-0 rounded-xl overflow-hidden bg-white
          transition-all duration-500 z-${showFlipped ? '10' : '0'} scale-${showFlipped ? '100' : '0'}
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
import React from 'react';

export default function Card({ type, isFlipped, isMatched, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="h-full w-full [perspective:1000px]"
    >
      <div 
        className={`
          relative h-full w-full 
          transition-transform duration-500 
          transform-gpu [transform-style:preserve-3d]
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        {/* Back of card (shows first) */}
        <div 
          className="absolute h-full w-full rounded-xl 
                     [backface-visibility:hidden] bg-white"
        >
          <img
            src="/src/assets/media/card-deck/back.svg"
            alt="Card back"
            className="h-full w-full rounded-xl"
          />
        </div>

        {/* Front of card (shows when flipped) */}
        <div 
          className="absolute h-full w-full rounded-xl 
                     [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <img
            src={`/src/assets/media/card-deck/${type}.svg`}
            alt={`Card ${type}`}
            className="h-full w-full rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
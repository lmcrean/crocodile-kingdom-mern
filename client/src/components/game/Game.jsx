import React, { useEffect, useState, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import Card from './Card';
import WordAssociationModal from '../modals/WordAssociation';
import HowToPlayModal from '../modals/HowToPlay';

export default function Game() {
  const { 
    cards, 
    matchedPairs, 
    flippedCards
  } = useGameContext();

  const {
    handleCardClick,
    resetGame,
    initializeGame,
    isLoading,
    error,
    checkAssociation
  } = useGameLogic();

  const [showAssociationModal, setShowAssociationModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  
  // Add refs to track previous state for debugging
  const prevFlippedCardsRef = useRef([]);
  const prevMatchedPairsRef = useRef([]);
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Show modal when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      console.log('[GAME] Two cards flipped, showing modal:', flippedCards);
      setShowAssociationModal(true);
    }
    
    // Debug changes to flipped cards
    if (JSON.stringify(flippedCards) !== JSON.stringify(prevFlippedCardsRef.current)) {
      console.log('[GAME] flippedCards changed:', 
        { previous: prevFlippedCardsRef.current, current: flippedCards });
      prevFlippedCardsRef.current = [...flippedCards];
    }
  }, [flippedCards]);

  // Track matched pairs changes for debugging
  useEffect(() => {
    if (JSON.stringify(matchedPairs) !== JSON.stringify(prevMatchedPairsRef.current)) {
      console.log('[GAME] matchedPairs changed:', 
        { previous: prevMatchedPairsRef.current, current: matchedPairs });
      prevMatchedPairsRef.current = [...matchedPairs];
    }
  }, [matchedPairs]);

  // Reset modal state when flippedCards is empty
  useEffect(() => {
    if (flippedCards.length === 0) {
      console.log('[GAME] flippedCards is empty, hiding modal');
      setShowAssociationModal(false);
    }
  }, [flippedCards]);

  // Get the flipped card objects for the modal
  const flippedCardObjects = cards.filter(card => flippedCards.includes(card.id));

  // Handle association submission
  const handleAssociationSubmit = (associationText, cardIds) => {
    console.log('[GAME] Submitting association:', { associationText, cardIds });
    checkAssociation(associationText, cardIds);
    setShowAssociationModal(false);
  };

  return (
    <div className="w-full">
      {/* Controls and Status Section */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Left side - Status */}
        <div className="flex items-center gap-6 text-white text-lg font-bold order-2 sm:order-1">
          <div className="flex items-center gap-2">
            <span>Matches:</span>
            <span>{matchedPairs.length / 2} / {cards.length / 2}</span>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex gap-2 order-1 sm:order-2">
          <button
            onClick={resetGame}
            disabled={isLoading}
            className={`px-3 py-2 bg-green-700 text-white rounded-full 
                     hover:bg-green-800 transition-colors shadow-lg
                     whitespace-nowrap ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Loading...' : 'Restart Game'}
          </button>
          <button
            onClick={() => setShowHowToPlayModal(true)}
            className="px-3 py-2 bg-green-700 text-white rounded-full 
                     hover:bg-green-800 transition-colors shadow-lg
                     whitespace-nowrap"
          >
            How to Play
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}. Please try refreshing the page.
        </div>
      )}

      {/* Word Association Modal */}
      <WordAssociationModal 
        isOpen={showAssociationModal}
        onClose={() => setShowAssociationModal(false)}
        onSubmit={handleAssociationSubmit}
        cards={flippedCardObjects}
      />

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlayModal}
        onClose={() => setShowHowToPlayModal(false)}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 
                     aspect-square w-full 
                     xs:max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] 
                     lg:max-w-none mx-auto">
          {Array.from({ length: 16 }).map((_, index) => (
            <div 
              key={`loading-${index}`}
              className="relative h-full w-full rounded-xl shadow-lg bg-blue-50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        /* Game Grid */
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
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { validateAssociation } from '../../utils/wordAssociation';

export default function WordAssociationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  cards 
}) {
  const [association, setAssociation] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Clear association when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAssociation('');
      setValidationError('');
    }
  }, [isOpen]);

  if (!isOpen || !cards || cards.length !== 2) return null;

  const validateInput = (text) => {
    if (!text || text.trim() === '') {
      return 'Please enter a sentence before submitting.';
    }
    
    const word1 = cards[0].word;
    const word2 = cards[1].word;
    
    if (!text.toLowerCase().includes(word1.toLowerCase()) && !text.toLowerCase().includes(word2.toLowerCase())) {
      return `Your sentence must include both words: ${word1} and ${word2}`;
    } else if (!text.toLowerCase().includes(word1.toLowerCase())) {
      return `Your sentence must include the word: ${word1}`;
    } else if (!text.toLowerCase().includes(word2.toLowerCase())) {
      return `Your sentence must include the word: ${word2}`;
    }
    
    // Check for minimum length
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length < 5) {
      return 'Your sentence should be at least 5 words long.';
    }
    
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validation
    const errorMessage = validateInput(association);
    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }
    
    console.log('[MODAL] Submitting association with words:', cards.map(c => c.word));
    onSubmit(association, cards.map(card => card.id));
    setAssociation('');
    setValidationError('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      data-testid="word-association-modal"
    >
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 shadow-2xl text-white">
        <h2 className="text-2xl font-bold text-center mb-4">Word Association Challenge</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {cards.map(card => (
            <div key={card.id} className="flex-1">
              <div className="h-40 sm:h-60 overflow-hidden rounded-lg mb-2">
                <img 
                  src={card.imagePath} 
                  alt={card.word} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center font-bold">{card.word}</p>
            </div>
          ))}
        </div>

        <p className="mb-4">Create a sentence using both words above (minimum 5 words):</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={association}
            onChange={(e) => {
              setAssociation(e.target.value);
              if (e.target.value.trim() !== '') {
                // Only clear validation error if we have content, but don't validate yet
                // to avoid showing errors while user is still typing
                if (validationError === 'Please enter a sentence before submitting.') {
                  setValidationError('');
                }
              }
            }}
            className={`w-full bg-gray-800 text-white border ${validationError ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 mb-2 min-h-[100px]`}
            placeholder="Write your sentence here..."
            data-testid="association-input"
          />
          
          {validationError && (
            <p className="text-red-500 mb-3 text-sm">
              {validationError}
            </p>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              data-testid="submit-association"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';

export default function WordAssociationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  cards 
}) {
  const [association, setAssociation] = useState('');

  if (!isOpen || !cards || cards.length !== 2) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(association, cards.map(card => card.id));
    setAssociation('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      data-testid="word-association-modal"
    >
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl">
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

        <p className="mb-4">Create a sentence using both words above:</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={association}
            onChange={(e) => setAssociation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 min-h-[100px]"
            placeholder="Write your sentence here..."
            data-testid="association-input"
          />
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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
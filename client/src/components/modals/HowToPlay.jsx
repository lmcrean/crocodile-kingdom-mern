import React from 'react';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      data-testid="how-to-play-modal"
    >
      <div className="bg-gray-900 rounded-xl w-full max-w-xl p-6 shadow-2xl text-white">
        <h2 className="text-2xl font-bold text-center mb-6">How to Play</h2>
        
        <p className="text-center text-lg mb-6">
          Match cards by creating word associations
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-bold">1</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">1. Flip a card</h3>
              <p className="text-gray-300">
                Click on any card to reveal the word and image.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-bold">2</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">2. Flip another card</h3>
              <p className="text-gray-300">
                Find a second card that you can connect with the first one.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-bold">3</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">3. Create a word association</h3>
              <p className="text-gray-300">
                Write a sentence using both words to create a connection between them.
                The sentence must:
              </p>
              <ul className="list-disc ml-5 mt-2 text-gray-300 space-y-1">
                <li>Include both words</li>
                <li>Be at least 5 words long</li>
                <li>Form a proper sentence with subject and verb</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-bold">4</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">4. Match all pairs to win</h3>
              <p className="text-gray-300">
                Successfully matched cards will remain face up. Try to match all pairs to win the game!
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

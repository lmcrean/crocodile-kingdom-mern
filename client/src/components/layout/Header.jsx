// src/components/layout/Header.jsx
import React from 'react';
import { VolumeX, Volume2, Mail } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';

export default function Header() {
  const { soundEnabled, musicEnabled, dispatch } = useGameContext();

  return (
    <header className="w-full flex md:flex-row lg:flex-col">
      {/* Logo Container - Responsive sizing */}
      <div className="relative h-32 sm:h-40 lg:h-48 mb-6 lg:mb-8">
        {/* Logo Background */}
        <img 
          src="/assets/media/crocodile-sprite/text-background.svg"
          alt=""
          className="w-full h-full object-contain"
        />
        
        {/* Crocodile Mascot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/assets/media/crocodile-sprite/regular.png"
            alt=""
            className="h-24 sm:h-32 lg:h-40 object-contain z-10"
          />
        </div>
        
        {/* Logo Text */}
        <img 
          src="/assets/media/crocodile-sprite/text-foreground.svg"
          alt="Crocodile Kingdom"
          className="absolute inset-0 w-full h-full object-contain z-20"
        />
      </div>

      {/* Controls - Responsive grid */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xs mx-auto lg:max-w-sm">
        {/* Sound Effects */}
        {/* <div className="flex flex-col items-center my-auto">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 
                     flex items-center justify-center text-white 
                     hover:bg-green-700 transition-colors p-0"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <span className="mt-2 text-xs sm:text-sm text-green-800 font-medium">SFX</span>
        </div> */}

        {/* Music */}
        {/* <div className="flex flex-col items-center my-auto">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MUSIC' })}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 
                     flex items-center justify-center text-white 
                     hover:bg-green-700 transition-colors p-0"
          >
            {musicEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <span className="mt-2 text-xs sm:text-sm text-green-800 font-medium">Music</span>
        </div> */}

        {/* Contact */}
        <div className="flex flex-col items-center my-auto">
          <a
            href="mailto:contact@crocodilekingdom.co.uk"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 
                     flex items-center justify-center text-white 
                     hover:bg-green-700 transition-colors"
          >
            <Mail size={20} />
          </a>
          <span className="mt-2 text-xs sm:text-sm text-green-800 font-medium">Contact</span>
        </div>
      </div>
    </header>
  );
}
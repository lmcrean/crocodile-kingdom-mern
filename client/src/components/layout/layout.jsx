// src/components/layout/Layout.jsx
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
      <div className="min-h-screen flex flex-col bg-green-50">
        {/* Fixed Background */}
        <div className="fixed inset-0 z-0">
          <img 
            src="/assets/media/background-imagery/tropical-jungle.svg"
            alt="Jungle background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Container - Responsive grid structure */}
        <div className="relative z-10 flex flex-col min-h-screen w-[100vw]">
          <div className="container mx-auto px-4 flex flex-col flex-grow
            xs:max-w-[100vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl
            lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8 xl:gap-12">
            
            {/* Left Column (Header + Controls) */}
            <div className="lg:sticky lg:top-0 lg:h-screen lg:pt-8">
              <Header />
            </div>
  
            {/* Right Column (Game Area) */}
            <main className="flex-1 py-8">
              {children}
            </main>
          </div>
  
          <Footer className="relative z-10" /> 
        </div>
      </div>
    );
  }
  
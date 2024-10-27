// src/components/layout/Layout.jsx
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const [isContentTall, setIsContentTall] = useState(false);
  const mainRef = React.useRef(null);

  useEffect(() => {
    const checkContentHeight = () => {
      if (mainRef.current) {
        const mainHeight = mainRef.current.getBoundingClientRect().height;
        const viewportHeight = window.innerHeight;
        setIsContentTall(mainHeight > viewportHeight - 100); // 100px buffer for footer
      }
    };

    checkContentHeight();
    window.addEventListener('resize', checkContentHeight);
    
    // Re-check on any content changes that might affect height
    const observer = new ResizeObserver(checkContentHeight);
    if (mainRef.current) {
      observer.observe(mainRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkContentHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-green-50 overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 min-w-full min-h-screen z-0">
        <img 
          src="/assets/media/background-imagery/tropical-jungle.svg"
          alt="Jungle background"
          className="w-screen h-screen object-cover"
        />
      </div>
      
      {/* Main Content Wrapper */}
      <div ref={mainRef} className="relative z-10 flex flex-col min-h-screen">
        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="container mx-auto px-4 flex-1
            xs:max-w-[100vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl
            lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8 xl:gap-12">
            
            {/* Left Column (Header + Controls) */}
            <div className="lg:sticky lg:top-0 lg:h-screen lg:pt-8">
              <Header />
            </div>
  
            {/* Right Column (Game Area) */}
            <main className="py-8">
              {children}
            </main>
          </div>
        </div>

        {/* Footer - will stick to bottom when content is shorter than viewport */}
        <Footer 
          className={`
            relative z-10 w-full bottom-0
            ${!isContentTall ? 'absolute bottom-0 left-0' : 'mt-auto'}
          `}
        />
      </div>
    </div>
  );
}
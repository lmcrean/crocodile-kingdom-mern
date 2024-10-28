// src/components/layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
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
      <div className="relative flex flex-col min-h-screen w-screen">
        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="container mx-auto px-4 flex-1
            xs:max-w-[100vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl
            xs:max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh]
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

        {/* Footer - stick to bottom */}
        <Footer 
          className="absolute bottom-0 w-[100vw]"
        />
      </div>
    </div>
  );
}
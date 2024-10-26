import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import tailwindLogo from '/tailwind.svg'

const App = () => {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.theme = darkMode ? 'light' : 'dark';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 
                    flex items-center justify-center p-6 w-[min(100vw)]
                    transition-colors duration-300">
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg 
                    w-[min(90vw,400px)] min-h-[400px]
                    flex flex-col items-center justify-between
                    p-8
                    transition-colors duration-300">
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-lg
                     bg-gray-100 dark:bg-gray-700 
                     hover:bg-gray-200 dark:hover:bg-gray-600
                     transition-colors duration-200"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Logo Section */}
        <div className="flex items-center justify-center space-x-6 pt-8">
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" 
             className="transform hover:scale-110 transition-transform duration-200">
            <img src={viteLogo} className="w-12 h-12" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer"
             className="transform hover:scale-110 transition-transform duration-200">
            <img src={reactLogo} className="w-12 h-12" alt="React logo" />
          </a>
          <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer"
     className="transform hover:scale-110 transition-transform duration-200">
            <img src="/tailwind.svg" className="w-12 h-12" alt="Tailwind logo" />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 
                       transition-colors duration-200 text-center">
          Vite + React + Tailwind
        </h1>

        {/* Counter Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCount(c => Math.max(0, c - 1))}
                    className="w-12 h-12 flex items-center justify-center 
                              bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700
                              text-white rounded-lg text-2xl font-bold transition-all duration-200">
              -
            </button>
            <span className="text-3xl font-semibold text-gray-700 dark:text-gray-200 
                           min-w-[3rem] text-center transition-colors duration-200">
              {count}
            </span>
            <button onClick={() => setCount(c => c + 1)}
                    className="w-12 h-12 flex items-center justify-center 
                              bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700
                              text-white rounded-lg text-2xl font-bold transition-all duration-200">
              +
            </button>
          </div>
          <button onClick={() => setCount(0)}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700
                            text-white rounded-lg transition-all duration-200">
            Reset
          </button>
        </div>

        {/* Info Section */}
        <div className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg 
                       transition-colors duration-200">
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
            Edit <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">src/App.jsx</code> to test HMR
          </p>
        </div>

        {/* Documentation Link */}
        <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer"
           className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                     text-sm underline transition-colors duration-200">
          Click here to learn more about Tailwind CSS
        </a>
      </div>
    </div>
  );
};

export default App;
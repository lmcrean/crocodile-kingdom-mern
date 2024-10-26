import React from 'react';
import { GameProvider } from './context/GameContext';
import Game from './components/game/Game';

const App = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default App;
// src/App.jsx
import React from 'react';
import { GameProvider } from './context/GameContext';
import Layout from './components/layout/Layout';
import Game from './components/game/Game';

const App = () => {
  return (
    <GameProvider>
      <Layout>
        <Game />
      </Layout>
    </GameProvider>
  );
};

export default App;
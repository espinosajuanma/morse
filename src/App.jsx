import { useState } from 'react';
import Game from './components/Game';
import Practice from './components/Practice';
import { LEVELS } from './utils/levels';
import { initAudio } from './utils/audio';

function App() {
  const [view, setView] = useState('menu'); // 'menu', 'game', 'practice'
  const [selectedLevel, setSelectedLevel] = useState(0);

  const startGame = (levelIndex) => {
    initAudio(); // Unlock audio context on user gesture
    setSelectedLevel(levelIndex);
    setView('game');
  };

  const startPractice = () => {
    initAudio();
    setView('practice');
  };

  return (
    <>
      <div id="logo">Morse</div>
      <hr />

      {view === 'menu' && (
        <div id="menu">
          <div id="introduction">
            <p>Aprende código Morse paso a paso. Escucha el sonido y presiona la letra correcta. ¡Consigue 5 puntos en cada letra para avanzar al siguiente nivel!</p>
          </div>
          
          <div className="menu-actions">
            <button className="btn-primary main-action" onClick={() => startGame(0)}>
              Comenzar
            </button>
            <button className="btn-secondary main-action" onClick={startPractice}>
              Práctica
            </button>
          </div>

          <hr />
          <h3>Selección de Nivel</h3>
          <div className="level-grid">
            {LEVELS.map((level, index) => (
              <button 
                key={level.id} 
                className="level-btn"
                onClick={() => startGame(index)}
              >
                <span className="level-num">{level.id}</span>
                <span className="level-letters">{level.letters.join(' · ')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'game' && (
        <Game initialLevel={selectedLevel} onBack={() => setView('menu')} />
      )}

      {view === 'practice' && (
        <Practice onBack={() => setView('menu')} />
      )}

      <hr />
      <div id="contribute">
        <p>
          Para contribuciones o consultas, contactame por <a target='_blank' rel="noreferrer" href='https://www.linkedin.com/in/espinosajuanma'>LinkedIn</a> o por <a href='mailto:hola@juanma.ar'>hola@juanma.ar</a>
        </p>
      </div>
    </>
  );
}

export default App;
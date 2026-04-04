import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import ReceptionGame from './components/ReceptionGame';
import Practice from './components/Practice';
import NotFound from './components/NotFound';
import { LEVELS } from './utils/levels';
import { initAudio } from './utils/audio';

function Menu() {
  const navigate = useNavigate();

  const startGame = (levelIndex) => {
    initAudio();
    navigate(`/reception/${levelIndex + 1}`);
  };

  const startPractice = () => {
    initAudio();
    navigate('/practice');
  };

  return (
    <div id="menu">
      <h3>Entrenamiento de recepción</h3>
      <p>Escucha el sonido y presiona la letra correcta. ¡Consigue 5 puntos en cada letra para avanzar al siguiente nivel!</p>
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
          <button key={level.id} className="level-btn" onClick={() => startGame(index)}>
            <span className="level-num">{level.id}</span>
            <span className="level-letters">{level.letters.join(' · ')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/reception/:level" element={<ReceptionGame onBack={() => navigate('/')} />} />
        <Route path="/practice" element={<Practice onBack={() => navigate('/')} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

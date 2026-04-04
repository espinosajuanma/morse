import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import ReceptionGame from './components/ReceptionGame';
import Practice from './components/Practice';
import About from './components/About';
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
      <div id="introduction">
        <p>
          Aprende telegrafía de forma progresiva mediante el método de
          refuerzo por pares. Este sistema está diseñado para convertir el
          ritmo de los caracteres en memoria auditiva, eliminando la necesidad
          de "traducir" mentalmente los puntos y rayas.
        </p>
      </div>

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
      <header className="app-header">
        <h1 id="logo" onClick={() => navigate('/')}>Morse</h1>
        <nav className="header-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>Acerca de</a>
          <div className="version">v{import.meta.env.VITE_APP_VERSION}</div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/reception/:level" element={<ReceptionGame onBack={() => navigate('/')} />} />
        <Route path="/practice" element={<Practice onBack={() => navigate('/')} />} />
        <Route path="/about" element={<About onBack={() => navigate('/')} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

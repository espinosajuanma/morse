import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS } from '../utils/levels';
import { playMorseSequence, initAudio } from '../utils/audio';
import morseAlphabet from '../utils/morseAlphabet';

const TARGET_POINTS = 5;

export default function ReceptionGame({ onBack }) {
  const { level } = useParams();
  const navigate = useNavigate();
  const parsedLevel = Number(level);

  const currentLevelIndex = useMemo(() => {
    const index = Number.isInteger(parsedLevel) ? parsedLevel - 1 : -1;
    return Math.max(0, Math.min(LEVELS.length - 1, index));
  }, [parsedLevel]);

  const [points, setPoints] = useState({});
  const [targetLetter, setTargetLetter] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', or null
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!level || !Number.isInteger(parsedLevel) || parsedLevel < 1 || parsedLevel > LEVELS.length) {
      navigate('/', { replace: true });
    }
  }, [level, parsedLevel, navigate]);

  // Cumulative letters up to the current level
  const availableLetters = useMemo(() => {
    return LEVELS.slice(0, currentLevelIndex + 1).flatMap(l => l.letters);
  }, [currentLevelIndex]);

  // Initialize level
  useEffect(() => {
    const initialPoints = {};
    availableLetters.forEach(letter => {
      initialPoints[letter] = 0;
    });
    setPoints(initialPoints);
    setTargetLetter(null);
    setFeedback(null);
  }, [currentLevelIndex, availableLetters]);

  // Pick a random letter that hasn't reached TARGET_POINTS
  const pickNextLetter = useCallback((currentPts) => {
    const pendingLetters = availableLetters.filter(l => currentPts[l] < TARGET_POINTS);
    
    if (pendingLetters.length === 0) {
      if (currentLevelIndex + 1 < LEVELS.length) {
        navigate(`/reception/${currentLevelIndex + 2}`);
      } else {
        alert("¡Felicidades! Has completado todos los niveles.");
        onBack();
      }
      return;
    }

    const randomLetter = pendingLetters[Math.floor(Math.random() * pendingLetters.length)];
    setTargetLetter(randomLetter);
    
    setIsProcessing(true);
    // Slight delay before playing next sound for pacing
    setTimeout(() => {
      playMorseSequence(morseAlphabet[randomLetter], () => {
        setIsProcessing(false);
      });
    }, 500);
  }, [availableLetters, currentLevelIndex, onBack, navigate]);

  // Start the first turn when points are initialized
  useEffect(() => {
    if (!targetLetter && Object.keys(points).length > 0 && !feedback) {
      initAudio(); // Requires user interaction prior to this component rendering
      pickNextLetter(points);
    }
  }, [points, targetLetter, feedback, pickNextLetter]);

  const handleInput = useCallback((inputLetter) => {
    if (isProcessing || !targetLetter || feedback) return;

    const upperInput = inputLetter.toUpperCase();
    if (!availableLetters.includes(upperInput)) return;

    setIsProcessing(true);
    const isCorrect = upperInput === targetLetter;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Calculate new points OUTSIDE the state updater to avoid double-firing
    const newPts = { ...points };
    if (isCorrect) {
      newPts[targetLetter] = Math.min(TARGET_POINTS, newPts[targetLetter] + 1);
    } else {
      newPts[targetLetter] = Math.max(0, newPts[targetLetter] - 1);
    }
    
    setPoints(newPts); // Pure state update

    // Queue the next turn safely
    setTimeout(() => {
      setFeedback(null);
      pickNextLetter(newPts);
    }, 1000);

  }, [isProcessing, targetLetter, feedback, availableLetters, points, pickNextLetter]);
  
  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[a-zA-Z]$/.test(e.key)) {
        handleInput(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Nivel {currentLevelIndex + 1}</h2>
        <button className="btn-secondary" onClick={onBack}>Volver</button>
      </div>

      <div className="game-screen">
        <div className={`feedback-indicator ${feedback || ''}`}>
          {feedback === 'correct' && <i className="bi-check-circle-fill"></i>}
          {feedback === 'incorrect' && <i className="bi-x-circle-fill"></i>}
          {!feedback && <i className="bi-soundwave"></i>}
        </div>
        
        {/* Hint: Show explicitly if points are 0 */}
        <div className="hint-display">
          {targetLetter && points[targetLetter] === 0 ? (
             <span className="hint-text">Escucha: {targetLetter} ({morseAlphabet[targetLetter]})</span>
          ) : (
             <span className="hint-text">¿Qué letra es?</span>
          )}
        </div>
      </div>

      <button className="btn-primary" onClick={() => playMorseSequence(morseAlphabet[targetLetter])} disabled={isProcessing || !targetLetter}>
        <i className="bi-play-fill"></i> Repetir Sonido
      </button>

      <div className="virtual-keyboard">
        {availableLetters.map(letter => {
          const progress = points[letter] || 0;
          return (
            <button 
              key={letter} 
              className="key-btn"
              onClick={() => handleInput(letter)}
              disabled={isProcessing}
            >
              <span className="key-letter">{letter}</span>
              <div className="progress-dots">
                {[...Array(TARGET_POINTS)].map((_, i) => (
                  <div key={i} className={`dot ${i < progress ? 'filled' : ''}`}></div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}
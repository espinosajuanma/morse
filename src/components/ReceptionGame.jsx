import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS } from '../utils/levels';
import { playMorseSequence, initAudio, supportsVibrate } from '../utils/audio';
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
  const [hasStarted, setHasStarted] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

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
        setHasStarted(false);
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
      }, { vibrate: supportsVibrate && isMobile && vibrateEnabled });
    }, 500);
  }, [availableLetters, currentLevelIndex, onBack, navigate, vibrateEnabled, isMobile]);

  useEffect(() => {
    if (hasStarted && !targetLetter && Object.keys(points).length > 0 && !feedback) {
      pickNextLetter(points);
    }
  }, [hasStarted, points, targetLetter, feedback, pickNextLetter]);

  const startLevel = useCallback(() => {
    if (hasStarted) return;
    initAudio();
    setHasStarted(true);
  }, [hasStarted]);

  const handleInput = useCallback((inputLetter) => {
    if (!hasStarted || isProcessing || !targetLetter || feedback) return;

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
        if (hasStarted) {
          handleInput(e.key);
        } else {
          const upperKey = e.key.toUpperCase();
          if (availableLetters.includes(upperKey)) {
            playMorseSequence(morseAlphabet[upperKey], undefined, { vibrate: supportsVibrate && isMobile && vibrateEnabled });
          }
        }
      }
      if (e.key === ' ') {
        if (hasStarted && targetLetter) {
          playMorseSequence(morseAlphabet[targetLetter], undefined, { vibrate: supportsVibrate && isMobile && vibrateEnabled });
        }
      }
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, hasStarted, isMobile, targetLetter, vibrateEnabled, availableLetters, onBack]);

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
          {!hasStarted ? (
            <span className="hint-text">Haz clic en Empezar para iniciar el nivel.</span>
          ) : targetLetter && points[targetLetter] === 0 ? (
            <span className="hint-text">Escucha: {targetLetter} ({morseAlphabet[targetLetter]})</span>
          ) : (
            <span className="hint-text">¿Qué letra es?</span>
          )}
        </div>
      </div>
      <button
        className="btn-primary"
        onClick={() => {
          if (!hasStarted) {
            startLevel();
            return;
          }
          playMorseSequence(morseAlphabet[targetLetter], undefined, { vibrate: supportsVibrate && isMobile && vibrateEnabled });
        }}
        disabled={hasStarted ? isProcessing || !targetLetter : false}
      >
        <i className="bi-play-fill"></i> {hasStarted ? 'Repetir' : 'Empezar'}
      </button>

      <div className="virtual-keyboard">
        {availableLetters.map(letter => {
          const progress = points[letter] || 0;
          return (
            <button 
              key={letter} 
              className="key-btn"
              onClick={() => {
                if (!hasStarted) {
                  playMorseSequence(morseAlphabet[letter], undefined, { vibrate: supportsVibrate && isMobile && vibrateEnabled });
                } else {
                  handleInput(letter);
                }
              }}
              disabled={isProcessing}
            >
              <span className="key-letter">{letter}</span>
              {!hasStarted ? (
                <span className="key-subtitle">{morseAlphabet[letter]}</span>
              ) : (
                <div className="progress-dots">
                  {[...Array(TARGET_POINTS)].map((_, i) => (
                    <div key={i} className={`dot ${i < progress ? 'filled' : ''}`}></div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {supportsVibrate && isMobile && (
        <div className="practice-settings">
          <button className={`btn-sm btn-secondary ${vibrateEnabled ? 'active' : ''}`} onClick={() => setVibrateEnabled(prev => !prev)}>
            {vibrateEnabled ? 'Vibración On' : 'Vibración Off'}
          </button>
        </div>
      )}
    </div>
  );
}
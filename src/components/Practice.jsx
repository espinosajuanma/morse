import { useState, useRef, useEffect } from 'react';
import MorseTable from './MorseTable';
import MorseButton from './MorseButton';
import morseAlphabet from '../utils/morseAlphabet';

export default function Practice({ onBack }) {
  const [display, setDisplay] = useState('');
  const [morseInput, setMorseInput] = useState('');
  const TIMEOUT = 1500;
  const timeoutRef = useRef(null);

  const handleMorseClick = (type) => {
    const morseChar = type === 'dot' ? '.' : '-';
    setMorseInput(prev => prev + morseChar);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const convertToLatin = () => {
    const letter = Object.entries(morseAlphabet).find(([_, code]) => code === morseInput)?.[0];
    setDisplay(letter ?? '?');
    setTimeout(() => setDisplay(''), TIMEOUT);
    setMorseInput('');
  };

  useEffect(() => {
    if (morseInput) {
      timeoutRef.current = setTimeout(convertToLatin, TIMEOUT);
    }
  }, [morseInput]);

  return (
    <div className="practice-container">
      <div className="game-header">
        <h3>Práctica de Transmisión</h3>
        <button className="btn-secondary" onClick={onBack}>Volver</button>
      </div>
      <p>Toca punto o raya para escribir. El sistema traducirá tu código a letras.</p>
      
      <div id="buttons" style={{ marginTop: '2rem' }}>
        <MorseButton type="dot" onClick={() => handleMorseClick('dot')} />
        <MorseButton type="dash" onClick={() => handleMorseClick('dash')} />
        <div id="display">
          {display || (morseInput ? '...' : '-')}
        </div>
      </div>
      
      <div className="current-input-display">
        {morseInput}
      </div>

      <hr />
      <h3>Alfabeto Internacional</h3>
      <MorseTable />
    </div>
  );
}
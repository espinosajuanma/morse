import { useState, useRef, useEffect } from 'react'
import MorseTable from './MorseTable'
import MorseButton from './MorseButton'
import morseAlphabet from './utils/morseAlphabet'

function App() {
  const [display, setDisplay] = useState('')
  const [morseInput, setMorseInput] = useState('')
  const TIMEOUT = 1500;
  const timeoutRef = useRef(null);

  const handleMorseClick = (type) => {
    const morseChar = type === 'dot' ? '.' : '-';
    setMorseInput(prev => prev + morseChar);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const convertToLatin = () => {
    const letter = Object.entries(morseAlphabet).find(([letter, code]) => code === morseInput)?.[0];
    setDisplay(letter ?? '');
    setTimeout(() => {
      setDisplay('');
    }, TIMEOUT);
    setMorseInput('');
  };

  useEffect(() => {
    if (morseInput) {
      timeoutRef.current = setTimeout(() => {
        console.log(morseInput);
        convertToLatin();
      }, TIMEOUT);
    }
  }, [morseInput]);

  return (
    <>
      <div id="logo">Morse</div>
      <hr />
      <div id="introduction">
        <p>
          Morse code is a system of communication that uses short signals (dots) and long signals (dashes) to represent letters, numbers, and punctuation. Developed by Samuel F. B. Morse, it was vital for early long-distance communication via telegraph.
        </p>
        <p>
          Each character has a unique dot-dash sequence. Today, despite newer technologies, Morse code is still used in amateur radio, emergency situations, and as an accessible communication method. Its simplicity allows communication even in challenging conditions.
        </p>
      </div>
      <hr />

      <div id="alphabet">
        <h3>The Morse Code Alphabet</h3>
        <p>
          Below you'll find the international Morse code alphabet.
        </p>
        <MorseTable />
      </div>
      <hr />

      <div id="learning">
        <h3>Learning Morse Code</h3>
        <ul>
          <li><strong>Start Simple:</strong> Learn common letters by sound first.</li>
          <li><strong>Use Memory Aids:</strong> Mnemonics can help you remember codes.</li>
          <li><strong>Practice Daily:</strong> Short, regular sessions are best.</li>
          <li><strong>Send and Receive:</strong> Practice both translating to and from Morse.</li>
          <li><strong>Accuracy First:</strong> Build speed gradually.</li>
          <li><strong>Use Online Tools:</strong> Many resources offer lessons and practice.</li>
          <li><strong>Listen Actively:</strong> Try to hear real Morse code transmissions.</li>
        </ul>
      </div>
      <hr />

      <div id="practice">
        <h3>Practice your Morse Code</h3>
        <p>
          Click the "dot" or "dash" buttons, and the system will display the corresponding character.
        </p>
        <div id="buttons">
          <MorseButton type="dot" onClick={() => handleMorseClick('dot')} />
          <MorseButton type="dash" onClick={() => handleMorseClick('dash')} />
          <div id="display">
            {display ?? '-'}
          </div>
        </div>
      </div>
      <hr />

      <div id="contribute">
        <h3>Contribute to the project</h3>
        <p>
          Your contributions can help keep this resource up-to-date and support the development of new features
        </p>
        <p>
          For contributions or inquiries, please reach out via <a target='_blank' href='https://www.linkedin.com/in/espinosajuanma'>LinkedIn</a> or at <a href='mailto:morse@juanma.ar'>morse@juanma.ar</a>
        </p>
      </div>
    </>
  )
}

export default App

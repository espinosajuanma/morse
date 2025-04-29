import 'bootstrap-icons/font/bootstrap-icons.css'
import morseAlphabet from './utils/morseAlphabet'

const MorseTable = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
      {Object.entries(morseAlphabet).map(([letter, code]) => (
        <div key={letter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>{letter}</span>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {code.split('').map((char, index) => (
              char === '.' ? <i key={index} className="bi-dot me-1"></i> :
              char === '-' ? <i key={index} className="bi-dash me-1"></i> :
              null
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MorseTable;
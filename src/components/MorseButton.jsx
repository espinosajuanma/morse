import { initAudio, playMorseSequence } from '../utils/audio';
import 'bootstrap-icons/font/bootstrap-icons.css'

const MorseButton = ({ type, onClick, silent = false, vibrate = false }) => {
  const handlePress = () => {
    const code = type === 'dot' ? '.' : '-';

    if (!silent) {
      initAudio();
    }

    playMorseSequence(code, undefined, { silent, vibrate });
    onClick();
  };

  return (
    <button className='button' onClick={handlePress}>
      {type === 'dot' ? <i className="bi-dot"></i> : <i className="bi-dash"></i>}
    </button>
  );
};

export default MorseButton;

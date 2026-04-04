import { initAudio, playMorseSequence } from '../utils/audio';
import 'bootstrap-icons/font/bootstrap-icons.css'

const MorseButton = ({ type, onClick }) => {
    const handlePress = () => {
        const code = type === 'dot' ? '.' : '-';

        initAudio();

        playMorseSequence(code, undefined, { vibrate: true });
        onClick();
    };

    return (
        <button className='button' onClick={handlePress}>
            {type === 'dot' ? <i className="bi-dot"></i> : <i className="bi-dash"></i>}
        </button>
    );
};

export default MorseButton;

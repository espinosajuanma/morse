import { useRef, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'

const MorseButton = ({ type, onClick }) => {
    const audioContextRef = useRef(null);

    useEffect(() => {
        // Initialize AudioContext
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(e => console.error("Error closing audio context", e));
            }
        };
    }, []);

    const playSound = () => {
        if (!audioContextRef.current) return;

        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine'; // Use a sine wave for a cleaner sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frequency (Hz)

        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Initial volume

        const duration = type === 'dot' ? 0.1 : 0.3; // Dot duration: 0.1s, Dash duration: 0.3s

        // Envelope for smoother sound (attack and release)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01); // Attack
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration + 0.01); // Release

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration + 0.02); // Stop slightly after release

        onClick(); // Call the onClick handler
    };

    return (
        <button className='button' onClick={playSound}>
            {type === 'dot' ? <i className="bi-dot"></i> : <i className="bi-dash"></i>}
        </button>
    );
};

export default MorseButton;
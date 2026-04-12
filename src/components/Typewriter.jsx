import { useState, useEffect } from 'react';

/**
 * Typewriter effect for retro RPG style dialogs.
 * Reveals text character by character.
 */
export default function Typewriter({ text, speed = 40, delay = 0, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // wait for initial delay before starting
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const typingTimer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(typingTimer);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [displayedText, hasStarted, text, speed, isComplete, onComplete]);

  return (
    <span>
      {displayedText}
      {hasStarted && !isComplete && <span className="animate-pixel-blink ml-1">_</span>}
    </span>
  );
}

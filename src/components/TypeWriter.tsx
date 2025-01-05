import { useState, useEffect, ReactNode } from 'react';

interface TypeWriterProps {
  words: ReactNode[];
  delay?: number;
}

export default function TypeWriter({ words, delay = 3000 }: TypeWriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const visibilityTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 500); // Time for fade out
    }, delay);

    return () => clearTimeout(visibilityTimeout);
  }, [currentWordIndex, words, delay]);

  return (
    <div className="min-h-[1.5em] flex items-center justify-center">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {words[currentWordIndex]}
      </div>
      <span className="animate-pulse ml-1">|</span>
    </div>
  );
} 
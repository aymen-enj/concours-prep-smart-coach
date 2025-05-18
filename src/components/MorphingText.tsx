import React, { useEffect, useState, useRef } from 'react';

interface MorphingTextProps {
  words: string[];
  baseText: string;
  className?: string;
}

const MorphingText: React.FC<MorphingTextProps> = ({ words, baseText, className = '' }) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Assurer que le texte s'affiche immédiatement
  useEffect(() => {
    // S'assurer que le mot initial est défini
    setCurrentWord(words[0]);
    
    let index = 0;
    // Simple interval pour changer le mot
    intervalRef.current = setInterval(() => {
      index = (index + 1) % words.length;
      setCurrentWord(words[index]);
    }, 2500); // Temps un peu plus court pour plus de dynamisme
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [words]);
  
  return (
    <span 
      className={className} 
      style={{ 
        display: 'inline-block', 
        fontWeight: 'bold',
        minWidth: '150px',  // Espace suffisant pour les mots plus longs
        textAlign: 'left'
      }}
    >
      {baseText}{currentWord}
    </span>
  );
};

export default MorphingText;

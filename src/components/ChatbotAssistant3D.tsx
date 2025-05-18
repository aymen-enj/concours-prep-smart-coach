import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ChatMessage {
  text: string;
  type: 'bot' | 'user';
}

const ChatbotAssistant3D: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', text: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider à préparer vos concours ?" }
  ]);
  
  // Animation pour le flottement du chatbot
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };
  
  // Animation pour l'effet de respiration
  const pulseAnimation = {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Animation pour les cercles orbitaux
  const orbitAnimation = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const orbitElement = orbitAnimation.current;
    if (!orbitElement) return;
    
    // Animer les particules en orbite
    const animate = () => {
      orbitElement.style.transform = `rotate(${Date.now() / 100 % 360}deg)`;
      requestAnimationFrame(animate);
    };
    
    const animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <motion.div
      className="relative z-10"
      animate={floatAnimation}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cercles orbitaux */}
      <div ref={orbitAnimation} className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 rounded-full border-2 border-blue-500/20 dark:border-blue-400/20"
            style={{ 
              transform: `rotateX(70deg) rotateY(${i * 40}deg)`,
              width: `${110 + i * 20}%`,
              height: `${110 + i * 20}%`,
              left: `${-5 - i * 10}%`,
              top: `${-5 - i * 10}%`
            }}
          />
        ))}
      </div>
      
      {/* Corps du chatbot */}
      <motion.div
        className="relative w-60 h-60"
        animate={pulseAnimation}
      >
        {/* Tête / Visage du chatbot */}
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center relative overflow-hidden">
          {/* "Écran" du visage */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-900/50 to-indigo-900/60 flex items-center justify-center">
            {/* Expressions faciales */}
            <div className="flex flex-col items-center gap-2">
              {/* Yeux */}
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-white/90"></div>
                <div className="w-3 h-3 rounded-full bg-white/90"></div>
              </div>
              {/* Bouche / Interface vocale */}
              <motion.div 
                className="w-12 h-1.5 bg-white/80 rounded-full"
                animate={{
                  scaleX: [1, 0.8, 1.2, 0.7, 1],
                  opacity: [0.7, 0.8, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
          
          {/* Points lumineux */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Corps */}
        <div className="w-20 h-20 mx-auto mt-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 relative flex items-center justify-center">
          {/* "Circuit" décoratif */}
          <div className="absolute inset-4 border-2 border-dashed border-blue-300/30 rounded-xl" />
          
          {/* Lumière centrale */}
          <motion.div
            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255, 255, 255, 0.5)',
                '0 0 0 10px rgba(255, 255, 255, 0)',
                '0 0 0 0 rgba(255, 255, 255, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-200" />
          </motion.div>
        </div>
        
        {/* Base / Support */}
        <div className="w-24 h-4 mx-auto mt-2 rounded-lg bg-gradient-to-r from-blue-800 to-indigo-900" />
      </motion.div>
      
      {/* Bulle de dialogue */}
      <motion.div
        className="absolute -right-8 top-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 w-64"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
          y: isHovered ? 0 : 10
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute left-3 -top-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45" />
        
        <div className="max-h-32 overflow-y-auto font-medium text-sm text-slate-600 dark:text-slate-200">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.type === 'bot' ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        
        {/* Input simulé */}
        <div className="mt-2 flex gap-2">
          <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-full" />
          <motion.div
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatbotAssistant3D;

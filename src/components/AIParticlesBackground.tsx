import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  fadeDirection: 'in' | 'out';
}

const AIParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialisation des particules
    const initParticles = () => {
      particles.current = [];
      
      // Couleurs inspirées par l'IA - tons de bleu et violet
      const colors = [
        'rgba(59, 130, 246, 0.7)', // blue-500
        'rgba(99, 102, 241, 0.7)', // indigo-500
        'rgba(139, 92, 246, 0.7)',  // purple-500
        'rgba(79, 70, 229, 0.6)'    // indigo-600
      ];
      
      // Créer particules
      const particleCount = Math.max(Math.floor(window.innerWidth / 20), 40);
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5,
          fadeDirection: Math.random() > 0.5 ? 'in' : 'out'
        });
      }
    };

    // Redimensionner le canvas à la taille de la fenêtre
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Réinitialiser les particules lors du redimensionnement
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation des particules
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner les particules
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        
        // Changer l'opacité selon la direction de fondu
        if (p.fadeDirection === 'in') {
          p.opacity += 0.002;
          if (p.opacity >= 0.5) p.fadeDirection = 'out';
        } else {
          p.opacity -= 0.002;
          if (p.opacity <= 0.1) p.fadeDirection = 'in';
        }
        
        // Dessiner la particule
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.7', p.opacity.toString());
        ctx.fill();
        
        // Connecter les particules proches
        connectParticles(p, i);
        
        // Mettre à jour la position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Rebondir sur les bords
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    // Connecter les particules proches
    const connectParticles = (particle: Particle, index: number) => {
      const maxDistance = 100;
      
      for (let j = index + 1; j < particles.current.length; j++) {
        const other = particles.current[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // Opacité basée sur la distance
          const opacity = 1 - (distance / maxDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    };

    // Lancer l'animation
    initParticles();
    animate();

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AIParticlesBackground;

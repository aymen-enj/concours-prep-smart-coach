import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  // Scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Référence pour l'élément 3D et son état de rotation
  const brainRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // Effet pour gérer la rotation 3D basée sur le mouvement de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!brainRef.current) return;
      
      const rect = brainRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calcul de la rotation basé sur la position de la souris par rapport au centre
      const rotateY = ((e.clientX - centerX) / (window.innerWidth / 2)) * 15;
      const rotateX = ((e.clientY - centerY) / (window.innerHeight / 2)) * -15;
      
      setRotation({ x: rotateX, y: rotateY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/10 to-primary/5 animate-gradient-background"></div>
        
        {/* Floating particles/circles for dynamic effect */}
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-slow"></div>
        
        {/* Dynamic grid lines for tech feel */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')]"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium mx-auto">
            <Award className="h-4 w-4 mr-2" />
            <span>Réussissez vos concours avec confiance</span>
          </div>
            
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-foreground leading-tight mb-10 max-w-4xl mx-auto">
            Préparez vos <span className="text-primary">concours</span> avec l'intelligence artificielle
          </h1>

          {/* 3D Animation du cerveau IA */}
          <div 
            ref={brainRef} 
            className="relative mx-auto w-60 h-60 mb-8 transition-transform duration-300 perspective-1000"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 md:w-56 md:h-56 relative bg-background/20 rounded-full backdrop-blur-xl shadow-xl p-4 transition-all duration-300 transform hover:scale-105">
                {/* Animation SVG */}
                <object
                  type="image/svg+xml"
                  data="/images/brain-circuit.svg"
                  className="w-full h-full"
                  aria-label="Animation du cerveau IA"
                >
                  Votre navigateur ne prend pas en charge les SVG
                </object>
                
                {/* Cercles lumineux autour du cerveau */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full blur-sm animate-pulse-slow"></div>
                <div className="absolute top-1/4 -right-3 w-3 h-3 bg-indigo-500 rounded-full blur-sm animate-pulse-slow delay-300"></div>
                <div className="absolute -bottom-2 left-1/3 w-5 h-5 bg-primary rounded-full blur-sm animate-pulse-slow delay-700"></div>
              </div>
            </div>
          </div>
            
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToFeatures}
              className="btn-primary text-base py-6 rounded-full group"
            >
              Découvrir nos fonctionnalités
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 text-base py-6 rounded-full">
              <Link to="/login">Espace étudiant</Link>
            </Button>
          </div>
            
          <div className="mt-8 text-sm text-muted-foreground">
            Déjà plus de <span className="font-bold text-primary">2,000+</span> étudiants nous font confiance
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

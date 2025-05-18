import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Lightbulb, Atom, Target, LineChart, Sparkles, ChevronDown, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Animation CSS
import "@/styles/animations.css";

// Composants avancés
import MorphingText from "./MorphingText";
import AIParticlesBackground from "./AIParticlesBackground";
import ChatbotAssistant3D from "./ChatbotAssistant3D";
import StudentAIIllustration from "./StudentAIIllustration";

// Composant Confetti pour ajouter un effet festif au bouton principal
const Confetti = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2 }}
              style={{
                top: "45%",
                backgroundColor: [
                  "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#ef4444", "#f97316",
                  "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6"
                ][Math.floor(Math.random() * 16)],
                animationFillMode: "forwards",
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationTimingFunction: "linear",
                animationName: [
                  "confetti-slow",
                  "confetti-medium",
                  "confetti-fast"
                ][Math.floor(Math.random() * 3)],
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg) translate(${Math.random() * 50 - 25}px, ${Math.random() * 30 - 15}px)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

const HeroSection = () => {
  // Refs & State
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeUsers, setActiveUsers] = useState(152);
  const [confettiActive, setConfettiActive] = useState(false);
  const [isHoveringPrimary, setIsHoveringPrimary] = useState(false);
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false);
  const controls = useAnimation();
  
  // Animation au scroll et initialisation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        
        if (isIntersecting) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    const currentHeroRef = heroRef.current;
    if (currentHeroRef) {
      observer.observe(currentHeroRef);
    }

    return () => {
      if (currentHeroRef) {
        observer.unobserve(currentHeroRef);
      }
    };
  }, [controls]);
  
  // Mise à jour aléatoire du nombre d'utilisateurs en temps réel
  useEffect(() => {
    if (!isVisible) return;
    
    // Fonction pour simuler des variations réalistes du nombre d'utilisateurs
    const updateActiveUsers = () => {
      setActiveUsers(prev => {
        // Générer un changement aléatoire entre -2 et +3 utilisateurs
        const change = Math.floor(Math.random() * 6) - 2;
        // S'assurer que le nombre reste entre 145 et 180
        return Math.max(145, Math.min(180, prev + change));
      });
    };
    
    // Mettre à jour toutes les 3-8 secondes
    const interval = setInterval(() => {
      updateActiveUsers();
    }, 3000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  // Fonction pour scroller aux fonctionnalités
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Gérer l'effet confetti lors du clic sur le bouton principal
  const handlePrimaryButtonClick = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 2000);
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center" ref={heroRef}>
      {/* Effet de confetti lors du clic sur le bouton principal */}
      <Confetti active={confettiActive} />
      
      {/* Particules AI en arrière-plan */}
      <AIParticlesBackground />
      
      {/* Arrière-plan de dégradé pour l'effet de profondeur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.07),transparent_80%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] animate-pulse-slow"></div>
      </div>
      
      {/* Contenu principal */}
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Colonne gauche - Contenu textuel */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            {/* Badge en haut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Réussissez vos concours avec confiance</span>
            </motion.div>
            
            {/* Titre principal */}
            <div className="mb-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="relative"
              >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
                  <div className="mb-4 text-black dark:text-white">
                    Préparez vos <span className="text-blue-600">concours</span>
                  </div>
                  <div className="text-black dark:text-white">
                    avec l'<span className="text-blue-600">IA</span>
                  </div>
                </h1>
              </motion.div>
            </div>
            
            {/* Sous-titre avec texte morphing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 text-lg text-slate-600 dark:text-slate-300"
            >
              <MorphingText 
                baseText="Une plateforme qui vous aide à " 
                words={[
                  "identifier vos points faibles.", 
                  "réviser efficacement.",
                  "progresser méthodiquement.",
                  "réussir vos examens."
                ]} 
              />
            </motion.div>
            
            {/* Badge utilisateurs actifs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center mb-8 p-3 bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm max-w-sm"
            >
              <div className="relative mr-4">
                <div className="flex">
                  {/* Avatars superposés */}
                  {[...Array(3)].map((_, index) => (
                    <div 
                      key={`avatar-${index}`}
                      className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 ${index > 0 ? '-ml-3' : ''}`}
                      style={{
                        backgroundImage: `url(https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index + 10}.jpg)`,
                        backgroundSize: 'cover',
                      }}
                    ></div>
                  ))}
                  <div className="w-8 h-8 -ml-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium border-2 border-white dark:border-slate-800">
                    +{Math.floor(activeUsers / 10)}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  <Users className="inline-block w-4 h-4 mr-1 text-blue-500" strokeWidth={2.5} />
                  <span className="font-semibold">{activeUsers}</span> étudiants en ligne
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Rejoignez-les maintenant
                </div>
              </div>
            </motion.div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: isHoveringPrimary ? 1.03 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-7 text-lg relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  onMouseEnter={() => setIsHoveringPrimary(true)}
                  onMouseLeave={() => setIsHoveringPrimary(false)}
                  onClick={handlePrimaryButtonClick}
                >
                  {isHoveringPrimary && (
                    <motion.div 
                      className="absolute inset-0 bg-white/10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.7 }}
                      style={{ borderRadius: '100%' }}
                    />
                  )}
                  <span className="mr-2">Commencer maintenant</span> 
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: isHoveringSecondary ? 1.03 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-7 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 relative overflow-hidden"
                  onMouseEnter={() => setIsHoveringSecondary(true)}
                  onMouseLeave={() => setIsHoveringSecondary(false)}
                  onClick={scrollToFeatures}
                >
                  {isHoveringSecondary && (
                    <motion.div 
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-700/30"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.7 }}
                      style={{ borderRadius: '100%' }}
                    />
                  )}
                  Découvrir les fonctionnalités
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Colonne droite - Visuel */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="flex justify-center items-center">
              {/* Illustration de l'étudiant avec IA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative shadow-2xl shadow-blue-500/10 w-full max-w-xl rounded-3xl overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                <StudentAIIllustration />
              </motion.div>
              
              {/* Chatbot 3D */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-12 -right-5 xl:right-12 2xl:right-20"
              >
                <ChatbotAssistant3D />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicateur de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        onClick={scrollToFeatures}
      >
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Découvrir plus</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;

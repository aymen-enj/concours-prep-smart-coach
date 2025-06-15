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
      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
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
                  "réviser efficacement.",
                  "progresser.",
                  "réussir.",
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
            
            {/* Boutons d'action améliorés */}
            <div className="flex flex-col sm:flex-row gap-5 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative group w-full sm:w-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <Link to="/login" className="w-full sm:w-auto block relative">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 py-7 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-violet-600 text-white shadow-lg relative z-10 border-0 overflow-hidden group-hover:shadow-blue-500/50 transition-all duration-300 rounded-lg"
                    onMouseEnter={() => setIsHoveringPrimary(true)}
                    onMouseLeave={() => setIsHoveringPrimary(false)}
                    onClick={handlePrimaryButtonClick}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-violet-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Particules d'énergie lors du survol */}
                    <div className="absolute inset-0 w-full h-full">
                      {isHoveringPrimary && [...Array(8)].map((_, i) => (
                        <motion.div
                          key={`particle-${i}`}
                          className="absolute w-1 h-1 rounded-full bg-white"
                          initial={{ 
                            x: '50%', 
                            y: '50%',
                            opacity: 0.8 
                          }}
                          animate={{ 
                            x: `${50 + (Math.random() * 60 - 30)}%`, 
                            y: `${50 + (Math.random() * 60 - 30)}%`,
                            opacity: 0
                          }}
                          transition={{ 
                            duration: 0.6 + Math.random() * 0.2,
                            ease: "easeOut" 
                          }}
                          style={{
                            scale: Math.random() * 1.5 + 1
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Effet de pulsation de la bordure */}
                    <motion.div 
                      className="absolute inset-0 rounded-lg border-2 border-white/30"
                      animate={{ 
                        opacity: isHoveringPrimary ? [0.2, 0.5, 0.2] : 0 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    
                    <span className="mr-3 relative">Commencer maintenant</span>
                    
                    {/* Flèche animée */}
                    <motion.div
                      animate={isHoveringPrimary ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="relative"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative group w-full sm:w-auto"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/30 to-slate-300/30 dark:from-slate-700/30 dark:to-slate-600/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-7 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 relative overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 z-10 rounded-lg group"
                  onMouseEnter={() => setIsHoveringSecondary(true)}
                  onMouseLeave={() => setIsHoveringSecondary(false)}
                  onClick={scrollToFeatures}
                >
                  {/* Effet de lumière qui se déplace */}
                  <motion.div 
                    className="absolute inset-0 w-40 h-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent skew-x-12"
                    animate={isHoveringSecondary ? {
                      x: [-200, 200],
                      opacity: [0, 1, 0]
                    } : {}}
                    transition={{
                      x: { duration: 1.5, repeat: Infinity, repeatDelay: 0.5 },
                      opacity: { duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }
                    }}
                  />
                  
                  <div className="flex items-center justify-center space-x-2">
                    <span>Découvrir les fonctionnalités</span>
                    <motion.div
                      animate={isHoveringSecondary ? { y: [0, -3, 0] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronDown className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-300" />
                    </motion.div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Colonne droite - Visuel */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="flex justify-end items-center pr-4 lg:pr-0">
              {/* Illustration de l'étudiant avec IA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative shadow-2xl shadow-blue-500/10 w-full max-w-xl rounded-3xl overflow-hidden mr-8 lg:mr-12"
                style={{ aspectRatio: '4/3' }}
              >
                <StudentAIIllustration />
              </motion.div>
              
              {/* Chatbot 3D */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-12 right-0 xl:right-16 2xl:right-24 z-20"
              >
                <ChatbotAssistant3D />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicateur de défilement amélioré - Position fixe pour éviter les conflits */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="inline-flex flex-col items-center cursor-pointer group"
          onClick={scrollToFeatures}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Badge de texte avec espacement amélioré */}
          <motion.div 
            className="relative px-6 py-3 mb-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-slate-800"
            whileHover={{ y: -2 }}
          >
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300">
              Découvrir plus
            </span>
          </motion.div>
          
          {/* Icône de flèche avec animation améliorée */}
          <motion.div
            className="bg-white/90 dark:bg-slate-800/90 rounded-full p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-lg backdrop-blur-md flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300"
            animate={{ y: [0, 6, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatDelay: 0.5 
            }}
          >
            <ChevronDown className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-indigo-500 transition-colors duration-300" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;

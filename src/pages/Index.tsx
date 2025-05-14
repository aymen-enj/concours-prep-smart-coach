import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, BookOpen, Star, ArrowRight, MessageSquare, Quote, Play, Video, ExternalLink, CheckCircle, LightbulbIcon, BrainCircuit, CreditCardIcon, BadgeCheck } from "lucide-react";
import { useState, useEffect, memo, lazy, Suspense } from "react";

// Import performance optimization utilities
import { useOptimizedAnimations } from "@/utils/use-optimized-animations";
import { setupLazyImageLoading } from "@/utils/perf-optimizer";

// Import the animations CSS file
import "@/styles/landing-transitions.css";

// Lazy load components for better initial load time
const HeroSection = lazy(() => import("@/components/HeroSection"));
const FeatureSection = lazy(() => import("@/components/FeatureSection"));

// Define types for the data used in components
interface StepData {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface TestimonialData {
  name: string;
  role: string;
  image: string;
  quote: string;
  stars: number;
  concours: string;
}

// Define component prop types
interface StepCardProps {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface TestimonialCardProps {
  testimonial: TestimonialData;
}

// Memoize carousel items to prevent unnecessary re-renders
const MemoizedStepCard = memo<StepCardProps>(({ step, title, description, icon: Icon }) => (
  <div className="carousel-item flex-shrink-0 w-[250px] sm:w-[280px] flex flex-col items-center relative z-10 mx-2">
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 sm:mb-6 text-lg sm:text-xl font-bold shadow-lg">
      {step}
    </div>
    <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm text-center hover-lift transition-all-300 h-full w-full">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-3 sm:mb-4">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      </div>
      <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
));

// Memoize testimonial card
const MemoizedTestimonialCard = memo<TestimonialCardProps>(({ testimonial }) => (
  <div className="carousel-item flex-shrink-0 w-[280px] sm:w-[330px] relative mx-2">
    <div className="bg-background h-full rounded-xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all-300 hover-lift">
      <Quote className="absolute right-4 top-4 h-5 w-5 sm:h-6 sm:w-6 text-gray-100 dark:text-gray-800" />
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <img 
          src={testimonial.image} 
          alt={testimonial.name} 
          width="56"
          height="56"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary"
          loading="lazy"
        />
        <div>
          <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, j) => (
          <Star 
            key={j} 
            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${j < testimonial.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 line-clamp-4 sm:line-clamp-5 relative z-10">
        "{testimonial.quote}"
      </p>
      
      <div className="pt-2 sm:pt-3 border-t border-border mt-auto">
        <div className="flex items-center gap-2">
          <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
          <span className="text-xs font-medium">{testimonial.concours}</span>
        </div>
      </div>
    </div>
  </div>
));

// Main component with optimizations
const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { 
    animationsLoaded, 
    animationSettings,
    getAnimationClass
  } = useOptimizedAnimations();
  
  // Testimonials data - move outside component to prevent re-creation
  const testimonials: TestimonialData[] = [
    {
      name: "Ahmed Benali",
      role: "Étudiant en prépa - École d'ingénieurs",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "Grâce à la plateforme, j'ai pu m'entraîner sur tous les concours des années précédentes. Les corrections IA m'ont permis d'identifier mes points faibles et de les améliorer rapidement.",
      stars: 5,
      concours: "CNC École Polytechnique"
    },
    {
      name: "Maria Tazi",
      role: "Étudiante en médecine",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      quote: "La correction personnalisée a fait toute la différence dans ma préparation. Les explications détaillées m'ont permis de comprendre mes erreurs et de progresser. J'ai réussi mon concours de médecine du premier coup !",
      stars: 5,
      concours: "Faculté de Médecine"
    },
    {
      name: "Soufiane Alami",
      role: "Étudiant en commerce - ENCG",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      quote: "Les exercices pratiques et les conseils personnalisés m'ont donné confiance pour aborder mon concours. La plateforme offre exactement ce dont j'avais besoin : des corrections précises et des recommandations pertinentes.",
      stars: 4,
      concours: "ENCG"
    },
    {
      name: "Yasmine Chakib",
      role: "Étudiante - École de Commerce",
      image: "https://randomuser.me/api/portraits/women/46.jpg",
      quote: "La préparation avec cette plateforme m'a permis d'aborder mes examens avec sérénité. Les nombreux exercices pratiques et les simulations de concours ont fait toute la différence.",
      stars: 5,
      concours: "ESCA"
    },
    {
      name: "Karim Ouadghiri",
      role: "Étudiant - Concours d'entrée",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      quote: "J'ai pu rapidement identifier mes lacunes grâce aux analyses détaillées de mes performances. Les conseils personnalisés ont été particulièrement utiles.",
      stars: 4,
      concours: "Concours National Commun"
    }
  ];

  // Steps data for how it works section - move outside component
  const howItWorksSteps: StepData[] = [
    {
      step: "1",
      title: "Choisissez votre concours",
      description: "Parcourez notre bibliothèque de concours et sélectionnez celui qui correspond à votre formation.",
      icon: BookOpen,
    },
    {
      step: "2",
      title: "Passez l'examen",
      description: "Répondez aux questions dans les conditions d'examen réelles avec un chronomètre et un environnement adapté.",
      icon: MessageSquare,
    },
    {
      step: "3",
      title: "Recevez votre correction",
      description: "Notre IA analyse vos réponses et vous fournit une correction détaillée et des recommandations personnalisées.",
      icon: Award,
    },
    {
      step: "4",
      title: "Analysez vos résultats",
      description: "Consultez les statistiques détaillées de votre performance et identifiez vos forces et faiblesses.",
      icon: CreditCardIcon,
    },
    {
      step: "5",
      title: "Améliorez vos compétences",
      description: "Suivez nos recommandations personnalisées pour améliorer vos points faibles et progresser rapidement.",
      icon: BadgeCheck,
    }
  ];
  
  // Setup optimizations after initial render
  useEffect(() => {
    // Setup lazy loading for images
    setupLazyImageLoading();
    
    // Apply carousel speed based on device capabilities
    document.documentElement.style.setProperty(
      '--carousel-speed', 
      `${animationSettings.carouselSpeed}s`
    );
    
    // Adjust animation complexity based on device capability
    if (animationSettings.useSimpleAnimations) {
      document.body.classList.add('reduce-animations');
    }
  }, [animationSettings]);
  
  // Function to open/close the video modal
  const toggleVideoModal = () => {
    setIsVideoModalOpen(!isVideoModalOpen);
  };

  // Only render background effects if device can handle them
  const renderBackgroundEffects = animationSettings.enableBackgroundEffects;

  // Create CSS variables for carousel speeds - fix TypeScript errors with CSS vars
  const carouselStyle = {
    '--carousel-speed': `${animationSettings.carouselSpeed}s`
  } as React.CSSProperties;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="hero" className={getAnimationClass('animate-fade-in', 'relative overflow-hidden')}>
          {/* Reduced number of animated background elements */}
          {renderBackgroundEffects && (
            <>
              <div className="absolute top-1/4 right-[5%] w-20 h-20 bg-primary/10 rounded-full blur-sm opacity-50 animate-swim-slow"></div>
              <div className="absolute bottom-1/4 left-[8%] w-32 h-32 bg-blue-400/10 rounded-full blur-sm opacity-40 animate-swim"></div>
            </>
          )}
          
          <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Chargement...</div>}>
            <HeroSection />
          </Suspense>
        </section>
        
        {/* Features Section */}
        <section id="features" className={getAnimationClass('animate-fade-in-up delay-300', 'relative overflow-hidden')}>
          {/* Reduced number of animated elements */}
          {renderBackgroundEffects && (
            <div className="absolute -top-10 left-[15%] w-24 h-24 bg-green-300/10 rounded-full blur-sm opacity-40 animate-swim"></div>
          )}
          
          <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Chargement...</div>}>
            <FeatureSection />
          </Suspense>
        </section>
        
        {/* Video Showcase Section - reduced animation elements */}
        <section id="video" className={`py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 relative overflow-hidden ${getAnimationClass('animate-fade-in-up delay-500')}`}>
          {/* Reduced number of decorative elements */}
          {renderBackgroundEffects && (
            <>
              <div className="absolute -top-40 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-blob delay-500"></div>
            </>
          )}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium animate-fade-in-up delay-100">
                <Video className="h-4 w-4 mr-2" />
                <span>Découvrez notre plateforme</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6 animate-fade-in-up delay-200">
                Voyez comment <span className="text-primary">Concours Prep</span> transforme votre préparation
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-300">
                Une démonstration complète de notre plateforme et de ses fonctionnalités.
              </p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Video thumbnail with play button */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 group animate-scale-in delay-400">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070" 
                  alt="Aperçu vidéo de la plateforme Concours Prep"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all-500"
                  loading="lazy"
                  width="2070"
                  height="1380"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex flex-col items-center justify-center">
                  <button 
                    className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border-2 border-white transition-transform-300 hover:scale-110 mb-4 shadow-lg group-hover:bg-primary/40 animate-fade-in delay-700"
                    aria-label="Lire la vidéo"
                    onClick={toggleVideoModal}
                  >
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-inner">
                      <Play className="h-10 w-10 text-white fill-white ml-1" />
                    </div>
                  </button>
                  <h3 className="text-white text-2xl font-medium mb-2 max-w-lg text-center px-4 animate-fade-in-up delay-500">
                    Comment réussir vos concours avec notre plateforme IA
                  </h3>
                  <p className="text-white/70 max-w-md text-center px-4 animate-fade-in-up delay-600">
                    Durée: 2:45 min
                  </p>
                </div>
              </div>
              
              {/* Video features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { title: "Interface intuitive", description: "Navigation facile pour une préparation efficace" },
                  { title: "Correction en temps réel", description: "Retour instantané sur vos réponses" },
                  { title: "Tableaux de bord personnalisés", description: "Suivi détaillé de votre progression" }
                ].map((feature, i) => (
                  <div 
                    key={i} 
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover-scale stagger-item animate-fade-in-up`}
                  >
                    <h4 className="font-medium text-foreground mb-1 flex items-center">
                      <CheckCircle className="text-primary h-4 w-4 mr-2 flex-shrink-0" />
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Video statistics */}
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                {[
                  { value: "94%", label: "Satisfaction utilisateurs" },
                  { value: "3.2M+", label: "Vues" }, 
                  { value: "8.9/10", label: "Note moyenne" }
                ].map((stat, i) => (
                  <div key={i} className={`text-center stagger-item animate-fade-in-up`}>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Additional resources */}
              <div className="mt-12 text-center animate-fade-in-up delay-500">
                <Button variant="outline" className="rounded-full group">
                  <span>Voir plus de vidéos tutorielles</span>
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Video modal - Can use createPortal for better performance */}
        {isVideoModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={toggleVideoModal}>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all-300"
                onClick={toggleVideoModal}
                aria-label="Fermer la vidéo"
              >
                &times;
              </button>
              <iframe 
                src="" 
                title="Présentation de la plateforme Concours Prep" 
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* How it works section - Optimized carousel */}
        <section id="how-it-works" className={`py-24 bg-muted/30 ${getAnimationClass('animate-fade-in-up delay-300')}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium animate-fade-in-up delay-100">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Comment ça marche</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6 animate-fade-in-up delay-200">
                En quelques étapes simples
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-300">
                Notre processus est conçu pour vous offrir une expérience d'apprentissage fluide et efficace.
              </p>
            </div>
            
            {/* Optimized carousel with will-change property and reduced complexity */}
            <div className="carousel-container carousel-pause pb-6">
              <div className="carousel-mask">
                <div className="carousel-track animate-infinite-scroll will-change-transform" style={carouselStyle}>
                  {/* First set of cards */}
                  <div className="carousel-group">
                    {howItWorksSteps.map((item, i) => (
                      <MemoizedStepCard key={i} {...item} />
                    ))}
                  </div>
                  
                  {/* Duplicate the cards for seamless looping */}
                  <div className="carousel-group">
                    {howItWorksSteps.map((item, i) => (
                      <MemoizedStepCard key={i} {...item} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Visual scroll indicators - Simplified */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full carousel-indicator"></div>
                ))}
              </div>
            </div>
            
            {/* Instructions text */}
            <div className="text-center mt-6 text-xs sm:text-sm text-muted-foreground animate-fade-in-up delay-500">
              <p>Survolez pour mettre en pause le défilement • Tous les éléments sont affichés automatiquement</p>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section - Optimized carousel */}
        <section id="testimonials" className={`py-24 ${getAnimationClass('animate-fade-in-up delay-500')}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium animate-fade-in-up delay-100">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Témoignages</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6 animate-fade-in-up delay-200">
                Ce que disent nos étudiants
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-300">
                Découvrez comment notre plateforme a aidé des étudiants à réussir leurs concours.
              </p>
            </div>
            
            {/* Optimized testimonials carousel */}
            <div className="carousel-container carousel-pause pb-6">
              <div className="carousel-mask">
                <div className="carousel-track animate-infinite-scroll-reverse will-change-transform" style={carouselStyle}>
                  {/* First set of testimonials */}
                  <div className="carousel-group">
                    {testimonials.map((testimonial, i) => (
                      <MemoizedTestimonialCard key={i} testimonial={testimonial} />
                    ))}
                  </div>
                  
                  {/* Duplicate for seamless looping */}
                  <div className="carousel-group">
                    {testimonials.map((testimonial, i) => (
                      <MemoizedTestimonialCard key={i} testimonial={testimonial} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Visual scroll indicators - Simplified */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full carousel-indicator"></div>
                ))}
              </div>
            </div>
            
            {/* Instructions text */}
            <div className="text-center mt-6 text-xs sm:text-sm text-muted-foreground animate-fade-in-up delay-500">
              <p>Survolez pour mettre en pause le défilement • Tous les témoignages sont affichés automatiquement</p>
            </div>
            
            <div className="mt-8 sm:mt-12 text-center animate-fade-in-up delay-700">
              <Button variant="outline" className="rounded-full group hover-lift">
                <span>Voir plus de témoignages</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Reduced animations */}
        <section className={`py-24 relative overflow-hidden ${getAnimationClass('animate-fade-in-up delay-700')}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-90"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
          
          {/* Reduced number of animated elements */}
          {renderBackgroundEffects && (
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-30 animate-blob"></div>
          )}
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-white/20 animate-scale-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-6 animate-fade-in-up delay-100">
                  Prêt à transformer votre préparation aux concours ?
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
                  Rejoignez des milliers d'étudiants qui ont déjà amélioré leurs résultats grâce à notre plateforme intelligente.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
                  <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-full py-6 text-base hover-scale animate-shimmer">
                    <Link to="/dashboard">
                      Commencer gratuitement
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 rounded-full py-6 text-base hover-lift">
                    <Link to="/login">Se connecter</Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { value: "15K+", label: "Étudiants" },
                  { value: "98%", label: "Satisfaction" },
                  { value: "30%", label: "Amélioration" },
                  { value: "7 jours", label: "Essai gratuit" }
                ].map((stat, i) => (
                  <div key={i} className="animate-fade-in-up">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

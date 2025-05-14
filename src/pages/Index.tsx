import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, BookOpen, Star, ArrowRight, MessageSquare, Quote, Play, Video, ExternalLink, CheckCircle, LightbulbIcon, BrainCircuit } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const testimonials = [
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
  ];

  // Function to open/close the video modal
  const toggleVideoModal = () => {
    setIsVideoModalOpen(!isVideoModalOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>
        
        {/* Features Section */}
        <section id="features">
          <FeatureSection />
        </section>
        
        {/* Video Showcase Section */}
        <section id="video" className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-40 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          
          {/* Animated floating elements */}
          <div className="absolute top-1/4 right-[15%] w-16 h-16 bg-blue-500 rounded-2xl rotate-12 opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 left-[15%] w-12 h-12 bg-green-500 rounded-full opacity-20 animate-float delay-200"></div>
          <div className="absolute top-2/3 right-[30%] w-10 h-10 bg-purple-500 rounded-lg rotate-45 opacity-20 animate-float delay-100"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
                <Video className="h-4 w-4 mr-2" />
                <span>Découvrez notre plateforme</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6">
                Voyez comment <span className="text-primary">Concours Prep</span> transforme votre préparation
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Une démonstration complète de notre plateforme et de ses fonctionnalités pour vous aider à comprendre comment elle peut vous faire réussir.
              </p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Video thumbnail with play button */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                {/* Replace this with your actual video embed if available */}
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070" 
                  alt="Aperçu vidéo de la plateforme Concours Prep"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex flex-col items-center justify-center">
                  <button 
                    className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border-2 border-white transition-transform hover:scale-110 mb-4 shadow-lg group-hover:bg-primary/40"
                    aria-label="Lire la vidéo"
                    onClick={toggleVideoModal}
                  >
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-inner">
                      <Play className="h-10 w-10 text-white fill-white ml-1" />
                    </div>
                  </button>
                  <h3 className="text-white text-2xl font-medium mb-2 max-w-lg text-center px-4">
                    Comment réussir vos concours avec notre plateforme IA
                  </h3>
                  <p className="text-white/70 max-w-md text-center px-4">
                    Durée: 2:45 min
                  </p>
                </div>
              </div>
              
              {/* Feature elements floating over the video */}
              <div className="absolute -right-12 top-1/3 transform rotate-6 hidden lg:block">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 border border-primary/20 max-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">IA avancée</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Notre IA analyse votre façon de répondre pour vous offrir des conseils personnalisés
                  </p>
                </div>
              </div>
              
              <div className="absolute -left-10 bottom-1/4 transform -rotate-3 hidden lg:block">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 border border-primary/20 max-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                      <LightbulbIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium">Conseils experts</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recevez des stratégies efficaces pour gérer votre temps pendant les concours
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
                  <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
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
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Additional resources */}
              <div className="mt-12 text-center">
                <Button variant="outline" className="rounded-full group">
                  <span>Voir plus de vidéos tutorielles</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Video modal - can be implemented with a proper modal component if available */}
        {isVideoModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={toggleVideoModal}>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
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
        
        {/* How it works section */}
        <section id="how-it-works" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Comment ça marche</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6">
                En quelques étapes simples
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Notre processus est conçu pour vous offrir une expérience d'apprentissage fluide et efficace.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 hidden md:block"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
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
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6 text-xl font-bold shadow-lg">
                      {item.step}
                    </div>
                    <div className="bg-background rounded-xl p-6 border border-border shadow-sm text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Témoignages</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6">
                Ce que disent nos étudiants
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Découvrez comment notre plateforme a aidé des étudiants à réussir leurs concours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all relative">
                  <Quote className="absolute right-8 top-8 h-8 w-8 text-gray-100 dark:text-gray-800" />
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star 
                        key={j} 
                        className={`h-4 w-4 ${j < testimonial.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 relative z-10">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{testimonial.concours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" className="rounded-full group">
                <span>Voir plus de témoignages</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-90"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-6">
                  Prêt à transformer votre préparation aux concours ?
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Rejoignez des milliers d'étudiants qui ont déjà amélioré leurs résultats grâce à notre plateforme intelligente.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-full py-6 text-base">
                    <Link to="/dashboard">
                      Commencer gratuitement
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 rounded-full py-6 text-base">
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
                  <div key={i}>
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

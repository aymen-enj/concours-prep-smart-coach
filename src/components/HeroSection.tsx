import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, BookOpen, Award } from "lucide-react";

const HeroSection = () => {
  const highlights = [
    "Correction IA personnalisée",
    "Concours des années précédentes",
    "Suivi de progression avancé"
  ];

  // Scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-900 dark:to-gray-800">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
              <Award className="h-4 w-4 mr-2" />
              <span>Réussissez vos concours avec confiance</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-foreground leading-tight mb-6">
              Préparez vos <span className="text-primary">concours</span> avec l'intelligence artificielle
            </h1>
            
            
            <div className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-foreground text-lg justify-center lg:justify-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
          
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-500 rounded-lg opacity-20 blur-xl transform -rotate-6 scale-105"></div>
            
            <div className="relative bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    <span className="font-semibold">Correction IA</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium dark:bg-green-900/30 dark:text-green-400">
                    98% Précision
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-medium mb-1">Question:</div>
                    <p className="text-foreground">Calculez la dérivée de f(x) = x³ + 2x² - 5x + 3</p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="text-sm font-medium mb-1 flex items-center">
                      <Award className="h-4 w-4 mr-1 text-primary" />
                      <span>Correction IA:</span>
                    </div>
                    <p className="text-foreground">La dérivée de f(x) = x³ + 2x² - 5x + 3 est f'(x) = 3x² + 4x - 5</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">Excellent travail! Vous avez correctement appliqué les règles de dérivation à chaque terme.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={scrollToFeatures}
                    className="inline-flex items-center text-primary text-sm font-medium transition-all hover:underline"
                  >
                    Voir plus d'exemples
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transform rotate-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-medium">Score</div>
                  <div className="text-lg font-bold">92%</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 transform -rotate-3">
              <div className="text-xs font-medium text-muted-foreground">Progression</div>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

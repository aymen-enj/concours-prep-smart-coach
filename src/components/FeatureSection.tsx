import { Award, BookOpen, ChartBar, FileText, Brain, CheckCircle, Target, Zap } from "lucide-react";

// Simple chart icon component
const Chart = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const features = [
  {
    title: "Concours authentiques",
    description: "Accédez à une bibliothèque complète de sujets de concours réels des années précédentes pour vous préparer efficacement.",
    icon: FileText,
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "Correction par IA",
    description: "Notre IA analyse vos réponses et fournit des corrections personnalisées avec des conseils d'amélioration ciblés.",
    icon: Brain,
    // Palette plus vive pour un meilleur contraste (fuchsia → violet)
    color: "from-fuchsia-500 to-violet-600"
  },
  {
    title: "Analyse de performance",
    description: "Visualisez votre progression avec des tableaux de bord détaillés qui identifient vos forces et faiblesses.",
    icon: ChartBar,
    color: "from-green-400 to-green-600"
  },
  {
    title: "Recommandations sur mesure",
    description: "Recevez des exercices et des ressources personnalisés en fonction de votre profil d'apprentissage.",
    icon: Target,
    color: "from-amber-400 to-amber-600"
  },
];

const benefits = [
  "Améliorez votre score de 30% en moyenne",
  "Économisez 15h de révision par semaine",
  "Identifiez rapidement vos points faibles",
  "Préparez plusieurs concours simultanément"
];

const FeatureSection = () => {
  // Scroll to video section
  const scrollToVideoSection = () => {
    const videoSection = document.getElementById("video");
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
            <Zap className="h-4 w-4 mr-2" />
            <span>Fonctionnalités exclusives</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-6">
            Une préparation intelligente pour des <span className="text-primary">résultats exceptionnels</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Notre plateforme combine intelligence artificielle et méthodes pédagogiques éprouvées pour vous offrir une expérience d'apprentissage optimale.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative cursor-pointer" onClick={scrollToVideoSection}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10" style={{ backgroundImage: `linear-gradient(to right, var(--${feature.color})` }}></div>
              <div className="flex gap-6 items-start p-6 rounded-2xl border border-border hover:border-primary/20 transition-colors bg-background hover:shadow-lg hover:shadow-primary/5">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r shadow-lg ${feature.color} text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Key benefits section */}
        <div className="bg-primary/5 rounded-2xl p-10 border border-primary/10 cursor-pointer hover:shadow-lg transition-shadow" onClick={scrollToVideoSection}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-poppins font-bold mb-4">
                Des résultats tangibles pour votre réussite
              </h3>
              <p className="text-muted-foreground mb-6">
                Notre approche a déjà aidé des milliers d'étudiants à améliorer significativement leurs performances aux concours les plus exigeants.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white ${['bg-blue-500', 'bg-amber-500', 'bg-green-500', 'bg-purple-500'][i]}`}>
                      <span className="sr-only">User</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">97%</span> de satisfaction
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-background rounded-xl shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center">
          {[
            { value: "15,000+", label: "Étudiants actifs" },
            { value: "98%", label: "Taux de réussite" },
            { value: "500+", label: "Concours disponibles" },
            { value: "24/7", label: "Support en ligne" }
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer" onClick={scrollToVideoSection}>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

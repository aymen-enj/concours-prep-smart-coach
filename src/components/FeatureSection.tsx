
import { Award, BookOpen, Clock, FileText } from "lucide-react";

// Simple chart icon component
const Chart = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
    description: "Entraînez-vous sur des sujets de concours réels des années précédentes.",
    icon: FileText,
  },
  {
    title: "Correction par IA",
    description: "Obtenez une évaluation personnalisée et des conseils d'amélioration par intelligence artificielle.",
    icon: BookOpen,
  },
  {
    title: "Suivi de progression",
    description: "Analysez votre évolution et identifiez vos points forts et axes d'amélioration.",
    icon: Chart,
  },
  {
    title: "Préparation efficace",
    description: "Gagnez du temps et augmentez vos chances de réussite aux concours.",
    icon: Award,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Pourquoi choisir notre plateforme?</h2>
          <p className="section-description mx-auto">
            Notre plateforme combine technologie avancée et méthodes pédagogiques éprouvées pour maximiser vos chances de réussite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-light-blue rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-royal-blue" />
              </div>
              <h3 className="font-poppins font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

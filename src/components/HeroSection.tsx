
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-light-blue py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-poppins font-bold text-dark-gray leading-tight mb-4">
              Préparez vos concours avec l'intelligence artificielle
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Entraînez-vous sur des anciens concours et recevez des corrections personnalisées grâce à notre IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-6 text-lg">
                <Link to="/dashboard">Commencer maintenant</Link>
              </Button>
              <Button asChild variant="outline" className="border-royal-blue text-royal-blue hover:bg-light-blue px-8 py-6 text-lg">
                <Link to="/login">Espace étudiant</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80" 
              alt="Préparation aux concours" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

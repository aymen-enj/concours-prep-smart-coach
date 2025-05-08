
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        
        {/* Testimonials Section */}
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Ce que disent nos étudiants</h2>
              <p className="section-description mx-auto">
                Découvrez comment notre plateforme a aidé des étudiants à réussir leurs concours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-royal-blue rounded-full flex items-center justify-center text-white font-bold">
                      {["A", "M", "S"][i-1]}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{["Ahmed", "Maria", "Soufiane"][i-1]}</h4>
                      <p className="text-sm text-gray-500">{["École d'ingénieurs", "Médecine", "Commerce"][i-1]}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    {[
                      "Grâce à la plateforme, j'ai pu m'entraîner sur tous les concours des années précédentes. Les corrections IA m'ont permis d'identifier mes points faibles.",
                      "La correction personnalisée a fait toute la différence dans ma préparation. J'ai réussi mon concours de médecine du premier coup !",
                      "Les examens pratiques et les conseils personnalisés m'ont donné confiance pour aborder mon concours. Merci Concours Prep !"
                    ][i-1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-royal-blue text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-poppins font-bold mb-6">
              Prêt à réussir vos concours ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'étudiants qui préparent efficacement leurs concours avec notre plateforme.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="secondary" size="lg" className="text-royal-blue bg-white hover:bg-gray-100">
                <Link to="/dashboard">Découvrir les concours</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                <Link to="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

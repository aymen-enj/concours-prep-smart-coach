
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 w-full max-w-lg mx-auto">
          <div className="w-36 h-36 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-bold text-primary">404</span>
            </div>
          </div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white mb-4">Page non trouvée</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée. 
            Pas d'inquiétude, vous pouvez retourner à l'accueil ou explorer d'autres sections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/support">Contacter le support</Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Vous semblez perdu ? <Link to="/dashboard" className="text-primary hover:underline">Découvrez nos concours</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

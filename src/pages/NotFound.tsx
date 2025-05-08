
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
      <main className="flex-grow flex items-center justify-center bg-light-gray">
        <div className="text-center p-6">
          <h1 className="text-6xl font-poppins font-bold text-royal-blue mb-4">404</h1>
          <p className="text-2xl font-medium text-gray-700 mb-6">Page non trouvée</p>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button asChild className="bg-royal-blue hover:bg-blue-700">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-royal-blue font-poppins font-bold text-xl">Concours Prep</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium">
                Accueil
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium">
                Concours
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium">
                Se connecter
              </Link>
              <Button className="bg-royal-blue text-white hover:bg-blue-700">
                S'inscrire
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-royal-blue focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Concours
            </Link>
            <Link
              to="/login"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Se connecter
            </Link>
            <Button 
              className="w-full bg-royal-blue text-white hover:bg-blue-700 mt-2"
              onClick={() => setIsOpen(false)}
            >
              S'inscrire
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

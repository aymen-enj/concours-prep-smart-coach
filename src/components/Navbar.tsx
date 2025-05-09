
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-royal-blue font-poppins font-bold text-xl dark:text-white">Concours Prep</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                Accueil
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                Concours
              </Link>
              <Link to="/support" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                Support
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                Se connecter
              </Link>
              <Button className="bg-royal-blue text-white hover:bg-blue-700">
                S'inscrire
              </Button>
              
              {/* Dark Mode Toggle */}
              <Button variant="outline" size="icon" onClick={toggleTheme} className="ml-2">
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle (Mobile) */}
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-royal-blue focus:outline-none dark:text-gray-200 dark:hover:text-white"
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
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Concours
            </Link>
            <Link
              to="/support"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Support
            </Link>
            <Link
              to="/login"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
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

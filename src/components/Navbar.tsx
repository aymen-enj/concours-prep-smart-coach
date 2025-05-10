
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/providers/AuthProvider";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { user } = useAuth();

  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle scroll event to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-gray-900 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-royal-blue">Concours</span>
              <span className="text-xl font-bold text-dark-gray dark:text-white">
                Prep
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-royal-blue"
                  : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
              }`}
            >
              Accueil
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "text-royal-blue"
                    : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                }`}
              >
                Tableau de Bord
              </Link>
            )}
            <Link
              to="/support"
              className={`text-sm font-medium transition-colors ${
                isActive("/support")
                  ? "text-royal-blue"
                  : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
              }`}
            >
              Support
            </Link>
          </nav>

          {/* Right section: Theme toggle + Auth */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Profile Menu or Auth Buttons */}
            <div className="hidden md:block">
              <ProfileMenu />
            </div>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link
                    to="/"
                    className={`text-base font-medium transition-colors ${
                      isActive("/")
                        ? "text-royal-blue"
                        : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                    }`}
                  >
                    Accueil
                  </Link>
                  {user && (
                    <Link
                      to="/dashboard"
                      className={`text-base font-medium transition-colors ${
                        isActive("/dashboard")
                          ? "text-royal-blue"
                          : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                      }`}
                    >
                      Tableau de Bord
                    </Link>
                  )}
                  <Link
                    to="/support"
                    className={`text-base font-medium transition-colors ${
                      isActive("/support")
                        ? "text-royal-blue"
                        : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                    }`}
                  >
                    Support
                  </Link>
                  
                  {!user ? (
                    <div className="flex flex-col gap-2 mt-4">
                      <Button variant="outline" asChild>
                        <Link to="/login">Connexion</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/login?tab=register">S'inscrire</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          const { signOut } = require("@/providers/AuthProvider").useAuth();
                          signOut();
                        }}
                      >
                        Se déconnecter
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

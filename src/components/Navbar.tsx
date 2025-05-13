
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, User, Settings as SettingsIcon, Bell } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { user } = useAuth();

  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
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
      className={cn(
        "sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm transition-all duration-300",
        isScrolled ? "shadow-md" : "",
        "border-b border-gray-100 dark:border-gray-800"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <span className="text-xl font-bold text-royal-blue group-hover:text-primary/80 transition-colors duration-200">Concours</span>
              <span className="text-xl font-bold text-dark-gray dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                Prep
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors relative px-1 py-2",
                isActive("/")
                  ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                  : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
              )}
            >
              Accueil
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors relative px-1 py-2",
                    isActive("/dashboard")
                      ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                      : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                  )}
                >
                  Tableau de Bord
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    "text-sm font-medium transition-colors relative px-1 py-2",
                    isActive("/settings")
                      ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                      : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                  )}
                >
                  Paramètres
                </Link>
              </>
            )}
            <Link
              to="/support"
              className={cn(
                "text-sm font-medium transition-colors relative px-1 py-2",
                isActive("/support")
                  ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                  : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
              )}
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
              onClick={() => toggleTheme()}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
              <span className="sr-only">Changer le thème</span>
            </Button>

            {/* Profile Menu or Auth Buttons */}
            <div className="hidden md:block">
              <ProfileMenu />
            </div>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link
                    to="/"
                    className={cn(
                      "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                      isActive("/")
                        ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                        : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                    )}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Accueil
                  </Link>
                  {user && (
                    <>
                      <Link
                        to="/dashboard"
                        className={cn(
                          "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                          isActive("/dashboard")
                            ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                            : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                        )}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        Tableau de Bord
                      </Link>
                      <Link
                        to="/settings"
                        className={cn(
                          "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                          isActive("/settings")
                            ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                            : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                        )}
                      >
                        <SettingsIcon size={18} />
                        Paramètres
                      </Link>
                    </>
                  )}
                  <Link
                    to="/support"
                    className={cn(
                      "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                      isActive("/support")
                        ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                        : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                    )}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>
                    Support
                  </Link>
                  
                  {!user ? (
                    <div className="flex flex-col gap-2 mt-4 px-2">
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to="/login" className="flex items-center gap-2">
                          <User size={18} />
                          Connexion
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link to="/login?tab=register" className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                          S'inscrire
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 px-2">
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          const { signOut } = require("@/providers/AuthProvider").useAuth();
                          signOut();
                        }}
                        className="w-full justify-start"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
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

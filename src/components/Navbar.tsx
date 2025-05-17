import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { Menu, Moon, Sun, User, Settings as SettingsIcon, Bell, BarChart, GraduationCap, HelpCircle, UserPlus, LogOut } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);
  
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Handle scroll event to control navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      // Get current scroll position
      const currentScrollPos = window.scrollY;
      
      // Determine if scrolled past threshold
      setIsScrolled(currentScrollPos > 10);
      
      // Determine scroll direction and update visibility
      const isScrollingDown = currentScrollPos > prevScrollPos;
      
      // Only hide navbar after scrolling down a bit (40px)
      if (isScrollingDown && currentScrollPos > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Update previous scroll position
      setPrevScrollPos(currentScrollPos);
      
      // Clear any existing timeout
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
      
      // Set a timeout to show navbar after scrolling stops
      const timeout = window.setTimeout(() => {
        setIsVisible(true);
      }, 1000); // Show navbar after 1 second of inactivity
      
      setScrollTimeout(timeout as unknown as number);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clear timeout on unmount
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, [prevScrollPos, scrollTimeout]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
        "transition-all duration-300 transform",
        isScrolled ? "shadow-md" : "",
        "border-b border-gray-100 dark:border-gray-800",
        isVisible ? "translate-y-0" : "-translate-y-full"
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
            {user && (
              <>
                <Link
                  to="/statistiques"
                  className={cn(
                    "text-sm font-medium transition-colors relative px-1 py-2",
                    isActive("/statistiques")
                      ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                      : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                  )}
                >
                  Statistiques
                </Link>
                <Link
                  to="/concours"
                  className={cn(
                    "text-sm font-medium transition-colors relative px-1 py-2",
                    isActive("/concours")
                      ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                      : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
                  )}
                >
                  Concours
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
            <Link
              to="/payment"
              className={cn(
                "text-sm font-medium transition-colors relative px-1 py-2",
                isActive("/payment")
                  ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-royal-blue after:rounded-full"
                  : "text-gray-600 hover:text-royal-blue dark:text-gray-300 dark:hover:text-royal-blue"
              )}
            >
              Tarifs
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
              <SheetContent 
                className="w-64 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" 
                aria-labelledby="sheet-title"
                aria-describedby="sheet-description"
              >
                <SheetHeader>
                  <SheetTitle id="sheet-title" className="text-lg font-semibold text-gray-900 dark:text-white">Menu principal</SheetTitle>
                  <SheetDescription id="sheet-description" className="sr-only">Navigation mobile de Concours Prep</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-6 mt-6">
                  
                  {user && (
                    <>
                      <Link
                        to="/statistiques"
                        className={cn(
                          "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                          isActive("/statistiques")
                            ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                            : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                        )}
                      >
                        <BarChart className="h-5 w-5" />
                        Statistiques
                      </Link>
                      <Link
                        to="/concours"
                        className={cn(
                          "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                          isActive("/concours")
                            ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                            : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                        )}
                      >
                        <GraduationCap className="h-5 w-5" />
                        Concours
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
                        <SettingsIcon className="h-5 w-5" />
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
                    <HelpCircle className="h-5 w-5" />
                    Support
                  </Link>
                  <Link
                    to="/payment"
                    className={cn(
                      "text-base font-medium transition-colors flex items-center gap-2 px-2 py-2 rounded-md",
                      isActive("/payment")
                        ? "text-royal-blue bg-gray-100 dark:bg-gray-800"
                        : "text-gray-600 hover:text-royal-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:text-royal-blue dark:hover:bg-gray-800/50"
                    )}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    Tarifs
                  </Link>
                  
                  {!user ? (
                    <div className="flex flex-col gap-2 mt-4 px-2">
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to="/login" className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Connexion
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link to="/login?tab=register" className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5" />
                          S'inscrire
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 px-2">
                      <Button 
                        variant="destructive" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          signOut();
                        }}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
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

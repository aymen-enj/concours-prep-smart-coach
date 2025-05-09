
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
                {t("home")}
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                {t("courses")}
              </Link>
              <Link to="/support" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                {t("support")}
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white">
                {t("login")}
              </Link>
              <Button className="bg-royal-blue text-white hover:bg-blue-700">
                {t("register")}
              </Button>
              
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-2">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("fr")}>
                    🇫🇷 Français {language === "fr" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    🇬🇧 English {language === "en" && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
            {/* Language Switcher (Mobile) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("fr")}>
                  🇫🇷 Français {language === "fr" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  🇬🇧 English {language === "en" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
              {t("home")}
            </Link>
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {t("courses")}
            </Link>
            <Link
              to="/support"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {t("support")}
            </Link>
            <Link
              to="/login"
              className="block text-gray-700 hover:text-royal-blue px-3 py-2 rounded-md font-medium dark:text-gray-200 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {t("login")}
            </Link>
            <Button 
              className="w-full bg-royal-blue text-white hover:bg-blue-700 mt-2"
              onClick={() => setIsOpen(false)}
            >
              {t("register")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

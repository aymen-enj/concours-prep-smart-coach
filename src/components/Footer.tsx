
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link 
      to={href} 
      className="text-gray-600 hover:text-primary transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary"
    >
      {children}
    </Link>
  );

  const SocialLink = ({ href, icon: Icon }: { href: string, icon: React.ComponentType<any> }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-gray-500 hover:text-primary transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary"
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">Social link</span>
    </a>
  );

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-royal-blue">Concours</span>
              <span className="text-xl font-bold text-dark-gray dark:text-white">Prep</span>
            </div>
            <p className="text-gray-600 max-w-xs dark:text-gray-400 mb-4">
              Plateforme intelligente pour la préparation aux concours, avec corrections IA personnalisées.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={Facebook} />
              <SocialLink href="https://twitter.com" icon={Twitter} />
              <SocialLink href="https://instagram.com" icon={Instagram} />
              <SocialLink href="https://linkedin.com" icon={Linkedin} />
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-dark-gray font-poppins font-semibold mb-4 dark:text-white">Navigation</h3>
            <ul className="space-y-3">
              <li><FooterLink href="/">Accueil</FooterLink></li>
              <li><FooterLink href="/dashboard">Services</FooterLink></li>
              <li><FooterLink href="/payment">Tarifs</FooterLink></li>
              <li><FooterLink href="/support">Support</FooterLink></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-dark-gray font-poppins font-semibold mb-4 dark:text-white">Légal</h3>
            <ul className="space-y-3">
              <li><FooterLink href="#">Conditions générales</FooterLink></li>
              <li><FooterLink href="#">Politique de confidentialité</FooterLink></li>
              <li><FooterLink href="#">Mentions légales</FooterLink></li>
              <li><FooterLink href="#">Cookies</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-dark-gray font-poppins font-semibold mb-4 dark:text-white">Contact</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>support@concoursprep.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>+212 5XX-XXXXXX</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm dark:text-gray-400">
              &copy; {currentYear} Concours Prep. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Conçu avec <span className="text-red-500">❤</span> pour les étudiants ambitieux
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

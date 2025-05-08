
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-light-gray">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-royal-blue font-poppins font-bold text-lg mb-4">Concours Prep</h3>
            <p className="text-gray-600 max-w-xs">
              Plateforme intelligente pour la préparation aux concours, avec corrections IA personnalisées.
            </p>
          </div>
          <div>
            <h3 className="text-dark-gray font-poppins font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-royal-blue">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-royal-blue">
                  Concours
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-gray-600 hover:text-royal-blue">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-royal-blue">
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-dark-gray font-poppins font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>support@concoursprep.com</li>
              <li>+212 5XX-XXXXXX</li>
              <li>Casablanca, Maroc</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Concours Prep. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

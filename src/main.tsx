
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Animation de chargement initial
const rootElement = document.getElementById("root");

if (rootElement) {
  // Ajouter une classe pour l'animation de chargement
  rootElement.classList.add('opacity-0');
  
  const root = createRoot(rootElement);
  root.render(<App />);

  // Animation de transition en douceur
  setTimeout(() => {
    rootElement.classList.remove('opacity-0');
    rootElement.classList.add('opacity-100', 'transition-opacity', 'duration-500');
  }, 100);
}

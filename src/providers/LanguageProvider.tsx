
import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  fr: {
    "home": "Accueil",
    "login": "Se connecter",
    "register": "S'inscrire",
    "support": "Support",
    "courses": "Concours",
    "darkMode": "Mode sombre",
    "lightMode": "Mode clair",
    "sendMessage": "Envoyer",
    "typeMessage": "Tapez votre message...",
    "welcome": "Bienvenue sur Concours Prep",
    "welcomeDescription": "Connectez-vous ou créez un compte pour accéder à nos ressources",
    "or": "OU",
    "email": "Email",
    "password": "Mot de passe",
    "forgotPassword": "Mot de passe oublié?",
    "fullName": "Nom complet",
    "createAccount": "Créer un compte",
    "loginWithGoogle": "Se connecter avec Google",
    "registerWithGoogle": "S'inscrire avec Google",
    "assistant": "Assistant Concours Prep",
    "assistantDescription": "Nous sommes là pour vous aider",
  },
  en: {
    "home": "Home",
    "login": "Login",
    "register": "Register",
    "support": "Support",
    "courses": "Courses",
    "darkMode": "Dark mode",
    "lightMode": "Light mode",
    "sendMessage": "Send",
    "typeMessage": "Type your message...",
    "welcome": "Welcome to Concours Prep",
    "welcomeDescription": "Login or create an account to access our resources",
    "or": "OR",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot password?",
    "fullName": "Full name",
    "createAccount": "Create account",
    "loginWithGoogle": "Sign in with Google",
    "registerWithGoogle": "Register with Google",
    "assistant": "Concours Prep Assistant",
    "assistantDescription": "We're here to help",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    return savedLanguage || "fr"; // Default to French
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

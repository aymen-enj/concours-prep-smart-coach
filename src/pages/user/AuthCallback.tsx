
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      // Redirect to dashboard regardless of error
      // If there's an error, the user will be redirected to login by RequireAuth
      navigate("/statistiques");
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h2 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">
        Authentification en cours...
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Veuillez patienter pendant que nous finalisons votre connexion
      </p>
    </div>
  );
};

export default AuthCallback;

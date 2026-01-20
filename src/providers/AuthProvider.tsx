import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          // Show the success toast only on the first sign-in for this session (not on page reload)
          try {
            const lastSignInAt = session?.user?.last_sign_in_at || '';
            const STORAGE_KEY = 'cp_toast_shown_for_last_sign_in_at';
            const alreadyShownFor = localStorage.getItem(STORAGE_KEY);
            if (lastSignInAt && alreadyShownFor !== lastSignInAt) {
              toast.success('Connexion réussie');
              localStorage.setItem(STORAGE_KEY, lastSignInAt);
            }
          } catch {}
        } else if (event === 'SIGNED_OUT') {
          toast.success('Déconnexion réussie');
          try {
            localStorage.removeItem('cp_toast_shown_for_last_sign_in_at');
          } catch {}
        } else if (event === 'PASSWORD_RECOVERY') {
          // Redirect to reset password page when password recovery link is clicked
          navigate("/reset-password");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      toast.success("Inscription réussie! Veuillez vérifier votre email.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate("/statistiques");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion");
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion avec Google");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success("Email de réinitialisation envoyé! Vérifiez votre boîte mail.");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi de l'email");
      throw error;
    }
  };

  const signOut = async () => {
    // 1. Nettoyage immédiat de l'état local pour rafraîchir l'UI tout de suite
    setUser(null);
    setSession(null);
    
    try {
      // 2. Tenter la déconnexion Supabase officielle
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Erreur Supabase signOut non bloquante:", error);
      }
    } catch (error) {
      console.warn("Exception lors du signOut:", error);
    } finally {
      // 3. IMPORTANT: Nettoyage manuel du localStorage pour éviter la rémanence du token
      // Supabase stocke le token sous une clé qui commence par "sb-" et finit par "-auth-token"
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key);
        }
      });

      navigate("/");
      // On force un petit rechargement si nécessaire ou juste un toast
      // toast.success("Bye bye!"); // Optionnel car on redirige
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

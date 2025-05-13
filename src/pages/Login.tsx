import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/components/ui/sonner";
import { Loader2, LogIn, UserPlus, LockKeyhole, Mail, User, ArrowRight, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const { user, signUp, signIn } = useAuth();

  // Animation effect when switching tabs
  const handleTabChange = (value: string) => {
    setAnimateContent(false);
    setActiveTab(value);
    setTimeout(() => setAnimateContent(true), 50);
  };

  // Initialize animation
  useState(() => {
    setTimeout(() => setAnimateContent(true), 50);
  });

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signUp(email, password, { full_name: name });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
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
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-96 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-96 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Animated particles - small circles */}
        <div className="absolute w-2 h-2 rounded-full bg-primary/20 top-[20%] left-[10%] animate-float -z-10"></div>
        <div className="absolute w-3 h-3 rounded-full bg-blue-400/20 top-[30%] right-[15%] animate-float-slow -z-10"></div>
        <div className="absolute w-2 h-2 rounded-full bg-primary/20 bottom-[25%] left-[20%] animate-float-slow -z-10"></div>
        <div className="absolute w-3 h-3 rounded-full bg-blue-400/20 bottom-[15%] right-[10%] animate-float -z-10"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
              <LockKeyhole className="h-4 w-4 mr-2" />
              <span>Espace Personnel</span>
            </div>
            <h2 className="text-3xl font-poppins font-bold text-foreground mb-3">
              Bienvenue sur Concours Prep
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Connectez-vous ou créez un compte pour accéder à nos ressources
            </p>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 rounded-full bg-muted/50">
              <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Inscription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent 
              value="login"
              className={cn(
                "transition-all duration-300 transform",
                animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
                <CardContent className="pt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full mb-4 flex items-center justify-center rounded-full h-11 border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={handleGoogleAuth}
                    disabled={isSubmitting}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-2">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Se connecter avec Google
                  </Button>
                  
                  <div className="relative my-5">
                    <Separator className="my-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">
                        OU
                      </span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-background/50 rounded-lg pl-3 h-11 focus-visible:ring-primary/30 border-border/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          Mot de passe
                        </Label>
                        <Link
                          to="#"
                          className="text-xs text-primary hover:underline"
                        >
                          Mot de passe oublié?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-background/50 rounded-lg h-11 focus-visible:ring-primary/30 pr-10 border-border/60"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={toggleShowPassword}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 rounded-full mt-2 transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          Se connecter
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent 
              value="register"
              className={cn(
                "transition-all duration-300 transform",
                animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
                <CardContent className="pt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full mb-4 flex items-center justify-center rounded-full h-11 border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={handleGoogleAuth}
                    disabled={isSubmitting}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-2">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    S'inscrire avec Google
                  </Button>
                  
                  <div className="relative my-5">
                    <Separator className="my-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">
                        OU
                      </span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        Nom complet
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="bg-background/50 rounded-lg h-11 focus-visible:ring-primary/30 border-border/60"
                        placeholder="Entrez votre nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="bg-background/50 rounded-lg h-11 focus-visible:ring-primary/30 border-border/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-background/50 rounded-lg h-11 focus-visible:ring-primary/30 pr-10 border-border/60"
                          placeholder="Créez un mot de passe fort"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={toggleShowPassword}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Minimum 8 caractères, avec des lettres et des chiffres
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 rounded-full mt-2 bg-gradient-to-r from-primary to-blue-600 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all border-0"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inscription en cours...
                        </>
                      ) : (
                        <>
                          Créer un compte
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              En vous connectant, vous acceptez nos{" "}
              <Link to="#" className="text-primary hover:underline">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link to="#" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add CSS for animations */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default Login;

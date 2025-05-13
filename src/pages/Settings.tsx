
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings as SettingsIcon, Shield, BellRing, Lock, Eye, Palette } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import AvatarUploader from "@/components/settings/AvatarUploader";
import ProfileForm from "@/components/settings/ProfileForm";
import AppearanceForm from "@/components/settings/AppearanceForm";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [animateContent, setAnimateContent] = useState(false);

  // Animation effect when switching tabs
  useEffect(() => {
    setAnimateContent(false);
    const timer = setTimeout(() => setAnimateContent(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Update avatar URL when user changes or after upload
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      try {
        // Add cache-busting parameter to force refresh
        const url = new URL(user.user_metadata.avatar_url);
        url.searchParams.set('t', Date.now().toString());
        setAvatarUrl(url.toString());
        console.log("Settings Avatar URL updated:", url.toString());
      } catch (error) {
        console.error("Error parsing avatar URL:", user.user_metadata.avatar_url, error);
        // Use the URL directly if it can't be parsed
        const cacheBustedUrl = `${user.user_metadata.avatar_url}?t=${Date.now()}`;
        setAvatarUrl(cacheBustedUrl);
      }
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return "?";
    
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    
    return user.email ? user.email.charAt(0).toUpperCase() : "?";
  };

  const TABS = [
    { id: "profile", label: "Profil", icon: <User className="h-4 w-4" /> },
    { id: "appearance", label: "Apparence", icon: <Palette className="h-4 w-4" /> },
    { id: "security", label: "Sécurité", icon: <Lock className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <BellRing className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl py-10 px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight relative inline-block">
            Paramètres
            <div className="absolute -bottom-1 left-0 w-1/3 h-1 bg-purple rounded-full"></div>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Gérez vos informations personnelles, vos préférences et la sécurité de votre compte.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar for larger screens */}
          <div className="hidden md:block md:col-span-3 space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-primary"}>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile tabs */}
          <div className="col-span-12 md:hidden">
            <TabsList className="grid grid-cols-4 w-full">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Main content area */}
          <div className="col-span-12 md:col-span-9">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsContent 
                value="profile" 
                className={cn(
                  "space-y-6 transition-all duration-300 transform", 
                  animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b pb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <AvatarUploader 
                        userId={user.id}
                        avatarUrl={avatarUrl}
                        onAvatarChange={setAvatarUrl}
                        getInitials={getInitials}
                      />
                      <div className="space-y-1 text-center md:text-left">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Informations personnelles
                        </CardTitle>
                        <CardDescription className="max-w-md">
                          Gérez vos informations personnelles et comment elles sont partagées sur la plateforme.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ProfileForm user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent 
                value="appearance" 
                className={cn(
                  "space-y-6 transition-all duration-300 transform", 
                  animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Apparence et accessibilité
                    </CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence de l'interface selon vos préférences visuelles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <AppearanceForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent 
                value="security" 
                className={cn(
                  "space-y-6 transition-all duration-300 transform", 
                  animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Sécurité du compte
                    </CardTitle>
                    <CardDescription>
                      Gérez votre mot de passe et les paramètres de sécurité de votre compte.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Shield className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Recommandation</h3>
                          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            <p>
                              Pour une meilleure sécurité, nous vous recommandons d'activer l'authentification à deux facteurs.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">La gestion de la sécurité sera bientôt disponible.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent 
                value="notifications" 
                className={cn(
                  "space-y-6 transition-all duration-300 transform", 
                  animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-primary" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Configurez comment et quand vous souhaitez être notifié.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <BellRing className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Les paramètres de notification seront bientôt disponibles.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

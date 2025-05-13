import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings as SettingsIcon, Shield, BellRing, Lock, Eye, Palette, Sparkles, Smartphone, Check, ChevronRight, Mail } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvatarUploader from "@/components/settings/AvatarUploader";
import ProfileForm from "@/components/settings/ProfileForm";
import AppearanceForm from "@/components/settings/AppearanceForm";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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
        const url = new URL(user.user_metadata.avatar_url);
        url.searchParams.set('t', Date.now().toString());
        setAvatarUrl(url.toString());
      } catch (error) {
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
      <div className="relative py-10 px-4 sm:px-6">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-1/4 h-64 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="container max-w-5xl mx-auto">
          <div className="text-center md:text-left mb-10">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-poppins font-bold text-foreground">
                Paramètres
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Gérez vos informations personnelles, vos préférences et la sécurité de votre compte.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar for larger screens */}
            <div className="hidden md:block md:col-span-3">
              <div className="sticky top-24 space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3",
                      activeTab === tab.id 
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/20" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <span className={cn(
                      "p-2 rounded-lg",
                      activeTab === tab.id 
                        ? "bg-white/20 text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-primary"
                    )}>
                      {tab.icon}
                    </span>
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="col-span-12 md:col-span-9">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                {/* Mobile tabs */}
                <div className="col-span-12 md:hidden mb-6">
                  <TabsList className="grid grid-cols-4 w-full bg-muted/50 p-1.5 rounded-xl">
                    {TABS.map((tab) => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-lg"
                      >
                        <span className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700">
                          {tab.icon}
                        </span>
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent 
                  value="profile" 
                  className={cn(
                    "space-y-6 transition-all duration-300 transform", 
                    animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
                    <CardHeader className="border-b border-border/40 pb-6">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <AvatarUploader 
                          userId={user.id}
                          avatarUrl={avatarUrl}
                          onAvatarChange={setAvatarUrl}
                          getInitials={getInitials}
                        />
                        <div className="space-y-2 text-center md:text-left">
                          <CardTitle className="flex items-center gap-2 justify-center md:justify-start">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            Informations personnelles
                          </CardTitle>
                          <CardDescription>
                            Gérez vos informations personnelles et comment elles sont partagées sur la plateforme.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
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
                  <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                    <CardHeader className="border-b border-border/40 pb-6">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Palette className="h-4 w-4" />
                        </div>
                        Apparence et accessibilité
                      </CardTitle>
                      <CardDescription>
                        Personnalisez l'apparence de l'interface selon vos préférences visuelles.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
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
                  <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-amber-600"></div>
                    <CardHeader className="border-b border-border/40 pb-6">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Lock className="h-4 w-4" />
                        </div>
                        Sécurité du compte
                      </CardTitle>
                      <CardDescription>
                        Gérez votre mot de passe et les paramètres de sécurité de votre compte.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
                            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Recommandation de sécurité</h3>
                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                              <p>
                                Pour une meilleure sécurité, nous vous recommandons d'activer l'authentification à deux facteurs.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <Card className="border border-border/40 shadow-sm bg-background/70 hover:shadow-md hover:border-primary/20 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                  <Smartphone className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-foreground">Authentification à deux facteurs</h3>
                                  <p className="text-sm text-muted-foreground">Sécurisez votre compte avec une double authentification</p>
                                </div>
                              </div>
                              <Switch disabled />
                            </div>
                            <Badge variant="outline" className="mt-3 bg-primary/5 text-muted-foreground border-primary/10">Bientôt disponible</Badge>
                          </CardContent>
                        </Card>

                        <Card className="border border-border/40 shadow-sm bg-background/70 hover:shadow-md hover:border-primary/20 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                  <Lock className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-foreground">Changement de mot de passe</h3>
                                  <p className="text-sm text-muted-foreground">Mettez à jour votre mot de passe</p>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-border/40 shadow-sm bg-background/70 hover:shadow-md hover:border-primary/20 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                  <Eye className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-foreground">Sessions actives</h3>
                                  <p className="text-sm text-muted-foreground">Gérez les appareils connectés</p>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
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
                  <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
                    <CardHeader className="border-b border-border/40 pb-6">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <BellRing className="h-4 w-4" />
                        </div>
                        Préférences de notifications
                      </CardTitle>
                      <CardDescription>
                        Personnalisez les notifications que vous souhaitez recevoir.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-5">
                        {[
                          {
                            title: "Nouveaux cours et concours",
                            description: "Soyez informé dès qu'un nouveau concours est disponible",
                            icon: <Sparkles className="h-4 w-4" />,
                            bgClass: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400",
                            enabled: true
                          },
                          {
                            title: "Résultats et corrections",
                            description: "Notifications lorsque vos résultats sont disponibles",
                            icon: <Check className="h-4 w-4" />,
                            bgClass: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
                            enabled: true
                          },
                          {
                            title: "Rappels et échéances",
                            description: "Rappels pour les concours et tests à venir",
                            icon: <BellRing className="h-4 w-4" />,
                            bgClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                            enabled: false
                          },
                          {
                            title: "Mise à jour du compte",
                            description: "Informations importantes sur votre compte",
                            icon: <User className="h-4 w-4" />,
                            bgClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
                            enabled: true
                          }
                        ].map((item, index) => (
                          <Card key={index} className="border border-border/40 shadow-sm bg-background/70 hover:shadow-md hover:border-primary/20 transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${item.bgClass}`}>
                                    {item.icon}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-foreground">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  </div>
                                </div>
                                <Switch defaultChecked={item.enabled} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Mail className="h-4 w-4" />
                        </div>
                        <p className="text-sm text-muted-foreground flex-1">
                          Vous pouvez également gérer vos préférences d'emails en cliquant sur le lien "Gérer les abonnements" dans nos emails.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

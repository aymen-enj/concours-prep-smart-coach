
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings as SettingsIcon, Shield, BellRing } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import AvatarUploader from "@/components/settings/AvatarUploader";
import ProfileForm from "@/components/settings/ProfileForm";
import AppearanceForm from "@/components/settings/AppearanceForm";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-10 px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos paramètres de compte et vos préférences.
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-center sm:justify-start">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 animate-in fade-in-50">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-muted/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Avatar
                </CardTitle>
                <CardDescription>
                  Mettez à jour votre photo de profil affichée sur votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AvatarUploader 
                  userId={user.id}
                  avatarUrl={avatarUrl}
                  onAvatarChange={setAvatarUrl}
                  getInitials={getInitials}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="bg-muted/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Informations du profil
                </CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 animate-in fade-in-50">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-muted/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence et le comportement de l'interface utilisateur.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AppearanceForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-muted/50 rounded-t-lg">
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
                  <p className="text-muted-foreground">Les paramètres de notification seront bientôt disponibles.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit comporter au moins 2 caractères.",
  }),
  full_name: z.string().min(2, {
    message: "Le nom complet doit comporter au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Adresse email invalide.",
  }),
});

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Veuillez sélectionner un thème.",
  }),
  language: z.enum(["fr", "en"], {
    required_error: "Veuillez sélectionner une langue.",
  }),
});

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.user_metadata?.username || "",
      full_name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
    },
  });

  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "light",
      language: "fr",
    },
  });

  async function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          full_name: data.full_name,
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: data.username,
          full_name: data.full_name,
        }
      });

      if (updateError) throw updateError;

      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function onAppearanceSubmit(data: z.infer<typeof appearanceFormSchema>) {
    toast.success("Paramètres d'apparence mis à jour");
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      
      // Include user ID in the file path for RLS policy compliance
      const filePath = `${user?.id}/${Date.now()}.${fileExt}`;

      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Update auth metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (authUpdateError) throw authUpdateError;

      toast.success("Avatar mis à jour avec succès");
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de l'avatar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

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
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos paramètres de compte et vos préférences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Apparence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>
                  Mettez à jour votre photo de profil affichée sur votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      <span>Changer l'avatar</span>
                    </div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={isLoading}
                    />
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG ou GIF. Taille maximale 2Mo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles.
                </CardDescription>
              </CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Il s'agit de votre nom d'affichage public.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john.doe@example.com" 
                              {...field} 
                              disabled
                            />
                          </FormControl>
                          <FormDescription>
                            L'email ne peut pas être modifié directement.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sauvegarder les modifications
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence et le comportement de l'interface utilisateur.
                </CardDescription>
              </CardHeader>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={appearanceForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thème</FormLabel>
                          <div className="flex flex-wrap gap-4">
                            <Label
                              htmlFor="light"
                              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:border-primary ${
                                field.value === "light" ? "border-primary" : "border-muted"
                              }`}
                            >
                              <div className="mb-3 h-24 w-40 rounded-md bg-[#FFFFFF] border" />
                              <div className="space-y-2">
                                <h3 className="font-medium leading-none">Clair</h3>
                                <p className="text-xs text-muted-foreground">
                                  Interface claire pour une utilisation diurne.
                                </p>
                              </div>
                              <Input
                                type="radio"
                                id="light"
                                value="light"
                                className="sr-only"
                                checked={field.value === "light"}
                                onChange={() => field.onChange("light")}
                              />
                            </Label>
                            <Label
                              htmlFor="dark"
                              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:border-primary ${
                                field.value === "dark" ? "border-primary" : "border-muted"
                              }`}
                            >
                              <div className="mb-3 h-24 w-40 rounded-md bg-[#0F172A] border" />
                              <div className="space-y-2">
                                <h3 className="font-medium leading-none">Sombre</h3>
                                <p className="text-xs text-muted-foreground">
                                  Interface sombre pour une utilisation nocturne.
                                </p>
                              </div>
                              <Input
                                type="radio"
                                id="dark"
                                value="dark"
                                className="sr-only"
                                checked={field.value === "dark"}
                                onChange={() => field.onChange("dark")}
                              />
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={appearanceForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Langue</FormLabel>
                          <div className="flex gap-4">
                            <Label
                              htmlFor="fr"
                              className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${
                                field.value === "fr" ? "border-primary" : "border-muted"
                              }`}
                            >
                              <Input
                                type="radio"
                                id="fr"
                                value="fr"
                                className="sr-only"
                                checked={field.value === "fr"}
                                onChange={() => field.onChange("fr")}
                              />
                              <span>Français</span>
                            </Label>
                            <Label
                              htmlFor="en"
                              className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${
                                field.value === "en" ? "border-primary" : "border-muted"
                              }`}
                            >
                              <Input
                                type="radio"
                                id="en"
                                value="en"
                                className="sr-only"
                                checked={field.value === "en"}
                                onChange={() => field.onChange("en")}
                              />
                              <span>English</span>
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sauvegarder les préférences
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

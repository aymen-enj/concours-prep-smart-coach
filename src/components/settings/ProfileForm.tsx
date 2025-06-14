
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { User } from "@supabase/supabase-js";

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

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Le mot de passe actuel est requis.",
  }),
  newPassword: z.string().min(8, {
    message: "Le nouveau mot de passe doit comporter au moins 8 caractères.",
  }),
  confirmPassword: z.string().min(1, {
    message: "La confirmation du mot de passe est requise.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

interface ProfileFormProps {
  user: User;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.user_metadata?.username || "",
      full_name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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

  async function onPasswordSubmit(data: z.infer<typeof passwordFormSchema>) {
    setIsPasswordLoading(true);
    
    try {
      // First verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: data.currentPassword,
      });

      if (signInError) {
        toast.error("Mot de passe actuel incorrect");
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (updateError) throw updateError;

      toast.success("Mot de passe mis à jour avec succès");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
    } finally {
      setIsPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information Form */}
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les modifications
          </Button>
        </form>
      </Form>

      <Separator className="my-6" />

      {/* Change Password Form */}
      <Card className="border border-border/40 shadow-sm bg-background/70">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Lock className="h-4 w-4" />
            </div>
            Changer le mot de passe
          </CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Entrez votre mot de passe actuel"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Entrez votre nouveau mot de passe"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Le mot de passe doit contenir au moins 8 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirmez votre nouveau mot de passe"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPasswordLoading} className="w-full">
                {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Mettre à jour le mot de passe
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;

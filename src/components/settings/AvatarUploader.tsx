
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploaderProps {
  userId: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  getInitials: () => string;
}

const AvatarUploader = ({ userId, avatarUrl, onAvatarChange, getInitials }: AvatarUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgKey, setImgKey] = useState(Date.now()); // Key to force re-render of image

  // Effect to force re-render of image when avatarUrl changes
  useEffect(() => {
    if (avatarUrl) {
      setImgKey(Date.now());
    }
  }, [avatarUrl]);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      
      // Include user ID in the file path for RLS policy compliance
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      console.log("Uploading file to path:", filePath);
      
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
      console.log("File uploaded, public URL:", publicUrl);
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update auth metadata with new cache-busting parameter
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: cacheBustedUrl }
      });

      if (authUpdateError) throw authUpdateError;

      // Force refresh of the auth object to get updated metadata
      await supabase.auth.refreshSession();
      
      // Pre-load the image to ensure it's cached
      const imgElement = document.createElement('img');
      imgElement.src = cacheBustedUrl;
      imgElement.onload = () => {
        // Update local state with cache busting
        onAvatarChange(cacheBustedUrl);
        toast.success("Avatar mis à jour avec succès");
        console.log("Avatar updated successfully");
      };
      
      imgElement.onerror = (e) => {
        console.error("Failed to preload avatar image:", e);
        toast.error("L'image a été téléchargée mais ne peut pas être affichée. Veuillez réessayer.");
      };

      // Reset file input to allow selecting the same file again if needed
      event.target.value = '';
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de l'avatar: ${error.message}`);
      console.error("Avatar update error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
      <Avatar className="h-32 w-32">
        {avatarUrl && (
          <AvatarImage 
            key={imgKey}
            src={avatarUrl} 
            alt="Profile"
          />
        )}
        <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-4">
        <Label htmlFor="avatar" className="cursor-pointer">
          <div className="flex items-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
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
    </div>
  );
};

export default AvatarUploader;

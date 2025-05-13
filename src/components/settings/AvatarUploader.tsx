
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Image as ImageIcon, Upload, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface AvatarUploaderProps {
  userId: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  getInitials: () => string;
}

const AvatarUploader = ({ userId, avatarUrl, onAvatarChange, getInitials }: AvatarUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgKey, setImgKey] = useState(Date.now()); // Key to force re-render of image
  const [isDragOver, setIsDragOver] = useState(false);

  // Effect to force re-render of image when avatarUrl changes
  useEffect(() => {
    if (avatarUrl) {
      setImgKey(Date.now());
      // Pre-fetch the image
      const img = new Image();
      img.src = avatarUrl;
    }
  }, [avatarUrl]);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    await uploadAvatar(file);
    
    // Reset file input to allow selecting the same file again if needed
    event.target.value = '';
  }

  async function uploadAvatar(file: File) {
    setIsLoading(true);
    toast.loading("Téléchargement en cours...", { 
      id: "avatar-upload",
      duration: 5000 
    });
    
    try {
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

      // Add cache-busting parameter to force refresh
      const timestamp = Date.now();
      const cacheBustedUrl = `${publicUrl}?t=${timestamp}`;
      
      // Update auth metadata with new cache-busting parameter
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: cacheBustedUrl }
      });

      if (authUpdateError) throw authUpdateError;

      // Force refresh of the auth object to get updated metadata
      await supabase.auth.refreshSession();
      
      // Add a slight delay before updating the UI
      setTimeout(() => {
        // Update local state with cache busting
        onAvatarChange(cacheBustedUrl);
        setImgKey(timestamp); // Force re-render
        toast.success("Avatar mis à jour avec succès", { id: "avatar-upload" });
        console.log("Avatar updated successfully");
      }, 500);
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de l'avatar: ${error.message}`, { id: "avatar-upload" });
      console.error("Avatar update error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle drag and drop functionality
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await uploadAvatar(file);
      } else {
        toast.error("Seules les images sont acceptées");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`flex flex-col items-center ${isDragOver ? 'scale-105' : ''} transition-transform duration-200`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className={`relative group cursor-pointer mb-3 ${isDragOver ? 'ring-4 ring-primary ring-opacity-60' : ''} transition-all duration-200`}>
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            {avatarUrl && (
              <AvatarImage 
                key={imgKey}
                src={avatarUrl} 
                alt="Profile"
                onError={() => {
                  console.error("Failed to load avatar image:", avatarUrl);
                }}
              />
            )}
            <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-purple">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-full transition-all duration-300">
            <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        
        <Label 
          htmlFor="avatar" 
          className="cursor-pointer"
        >
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm"
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{isLoading ? "Téléchargement..." : "Changer l'avatar"}</span>
          </Button>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={isLoading}
          />
        </Label>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          JPG, PNG ou GIF. Taille maximale 2Mo.
        </p>
        <p className="text-xs text-muted-foreground mt-1 text-center opacity-75">
          Glissez et déposez une image ici ou cliquez pour choisir un fichier
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;

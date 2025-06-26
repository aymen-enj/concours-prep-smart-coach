
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploaderProps {
  userId: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  getInitials: () => string;
}

const AvatarUploader = ({ userId, avatarUrl, onAvatarChange, getInitials }: AvatarUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploadProgress(0);
    
    const toastId = "avatar-upload";
    toast.loading("Préparation de l'image...", { id: toastId, duration: 5000 });
    
    try {
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const fileExt = file.name.split('.').pop();
      
      // Include user ID in the file path for RLS policy compliance
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      console.log("Uploading file to path:", filePath);
      
      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;
      
      clearInterval(interval);
      setUploadProgress(95);
      toast.loading("Finalisation...", { id: toastId });

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

      // Update auth metadata - no cache busting needed for new uploads
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (authUpdateError) throw authUpdateError;

      // Force refresh of the auth object to get updated metadata
      await supabase.auth.refreshSession();
      
      setUploadProgress(100);
      
      // Add a slight delay before updating the UI
      setTimeout(() => {
        // Update local state
        onAvatarChange(publicUrl);
        toast.success("Avatar mis à jour avec succès", { id: toastId });
        console.log("Avatar updated successfully");
      }, 500);
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de l'avatar: ${error.message}`, { id: toastId });
      console.error("Avatar update error:", error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
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

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={cn(
          "flex flex-col items-center",
          isDragOver ? 'scale-105' : '',
          "transition-transform duration-200"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div 
          className={cn(
            "relative group cursor-pointer mb-3",
            isDragOver ? 'ring-4 ring-primary ring-opacity-60' : '',
            "transition-all duration-200"
          )}
          onClick={handleOpenFileDialog}
        >
          <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-900 shadow-xl">
            {avatarUrl && (
              <AvatarImage 
                src={avatarUrl} 
                alt="Profile"
                loading="eager"
                onError={() => {
                  console.error("Failed to load avatar image:", avatarUrl);
                }}
              />
            )}
            <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload progress indicator */}
          {isLoading && uploadProgress > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-300 dark:text-gray-700" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="45" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-primary" 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 * ((100 - uploadProgress) / 100)}
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="45" 
                      cx="50" 
                      cy="50" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{uploadProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
            className="bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700"
            disabled={isLoading}
            size="sm"
            onClick={handleOpenFileDialog}
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
            ref={fileInputRef}
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

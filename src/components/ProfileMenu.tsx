
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imgKey, setImgKey] = useState(Date.now()); // Key to force re-render of image
  
  // Update avatar URL when user changes
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      try {
        // Add cache-busting parameter to force refresh
        const url = new URL(user.user_metadata.avatar_url);
        url.searchParams.set('t', Date.now().toString());
        setAvatarUrl(url.toString());
        setImgKey(Date.now()); // Force re-render
        console.log("Menu Avatar URL updated:", url.toString());
      } catch (error) {
        console.error("Error parsing avatar URL:", user.user_metadata.avatar_url, error);
        // Use the URL directly if it can't be parsed
        const cacheBustedUrl = `${user.user_metadata.avatar_url}?t=${Date.now()}`;
        setAvatarUrl(cacheBustedUrl);
        setImgKey(Date.now()); // Force re-render
      }
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return "?";
    
    // Try to get from full_name in user metadata
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    
    // Fallback to email
    return user.email ? user.email.charAt(0).toUpperCase() : "?";
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "";
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    return user.email ? user.email.split("@")[0] : "";
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to="/login">Connexion</Link>
        </Button>
        <Button asChild>
          <Link to="/login?tab=register">S'inscrire</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-1 pr-2">
          <Avatar className="h-8 w-8">
            {avatarUrl && (
              <AvatarImage 
                key={imgKey}
                src={avatarUrl} 
                alt="Profile"
                onError={() => console.error("Profile menu avatar failed to load:", avatarUrl)}
              />
            )}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block text-sm font-medium">
            {getDisplayName()}
          </span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span> Services</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;

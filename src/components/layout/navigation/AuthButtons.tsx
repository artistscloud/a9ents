
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthButtonsProps {
  user: User | null;
  loading: boolean;
  onSignOut: () => Promise<void>;
}

export function AuthButtons({ user, loading, onSignOut }: AuthButtonsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await onSignOut();
      toast({
        title: "Successfully signed out",
        duration: 2000
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" onClick={() => navigate('/login')}>
        Sign In
      </Button>
      <Button onClick={() => navigate('/signup')}>
        Sign Up
      </Button>
    </>
  );
}

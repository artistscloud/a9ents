
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface AuthButtonsProps {
  user: User | null;
  loading: boolean;
  onSignOut: () => Promise<void>;
}

export function AuthButtons({ user, loading, onSignOut }: AuthButtonsProps) {
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="outline" onClick={onSignOut}>
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
